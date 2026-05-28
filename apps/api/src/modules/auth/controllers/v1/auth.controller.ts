import { ApiResource } from '@/decorators/api-resource.decorator.js';
import { Public } from '@/decorators/public.decorator.js';
import {
    Body,
    Controller,
    Inject,
    NotFoundException,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import type { Static } from '@sinclair/typebox';
import { RoleEntity, UserEntity } from '@yugo/nestjs-database/entities';
import { Roles } from '@yugo/shared';
import { compareSync } from 'bcrypt';
import { DataSource } from 'typeorm';
import { OTP_SERVICE } from '../../constants.js';
import {
    AuthSignInPayload,
    OtpSendPayload,
    OtpVerifyPayload,
} from '../../dtos/payloads.js';
import {
    AuthSignInResponse,
    OtpSendResponse,
    OtpVerifyResponse,
} from '../../dtos/responses.js';
import type { OtpService } from '../../services/otp-service.interface.js';
import { TokenService } from '../../services/token.service.js';

@ApiTags('auth')
@Public()
@Controller({ path: 'auth', version: '1' })
export class V1AuthController {
    constructor(
        @Inject(OTP_SERVICE) private readonly otpService: OtpService,
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly tokenService: TokenService,
    ) {}

    @ApiResource(AuthSignInResponse)
    @ApiBody({ schema: AuthSignInPayload })
    @Post('signin')
    async signIn(@Body() body: Static<typeof AuthSignInPayload>) {
        const user = await this.datasource.manager.findOne(UserEntity, {
            where: { email: body.email },
            relations: {
                roles: true,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.active) {
            throw new UnauthorizedException('Your account has been deactivated. Please contact administrator.');
        }
        if (!compareSync(body.password, user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.tokenService.generateTokens({
            id: user.id,
            email: body.email,
            roles: user.roles.map((role) => role.name),
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                roles: user.roles.map((role) => role.name),
            },
        };
    }

    @ApiBody({ schema: OtpSendPayload })
    @ApiResource(OtpSendResponse)
    @Post('otp/send')
    async sendOtp(@Body() body: Static<typeof OtpSendPayload>) {
        const manager = this.datasource.manager;
        let user = await manager.findOne(UserEntity, {
            where: { mobilenumber: body.mobilenumber },
        });
        if (!user) {
            user = manager.create(UserEntity, {
                mobilenumber: body.mobilenumber,
                roles: [manager.create(RoleEntity, { name: Roles.CUSTOMER })],
            });
            await manager.save(user);
        }
        await this.otpService.sendOtp({ mobilenumber: body.mobilenumber });
        return {
            mobilenumber: body.mobilenumber,
            method: 'sms' as const,
            otpSent: true,
        };
    }

    @ApiBody({ schema: OtpSendPayload })
    @ApiResource(OtpSendResponse)
    @Post('otp/resend')
    async resendOtp(@Body() body: Static<typeof OtpSendPayload>) {
        const manager = this.datasource.manager;
        const user = await manager.findOne(UserEntity, {
            where: { mobilenumber: body.mobilenumber },
        });
        if (!user) {
            throw new NotFoundException(
                'User not found. Please send OTP first.',
            );
        }
        await this.otpService.resendOtp(body.mobilenumber);
        return {
            mobilenumber: body.mobilenumber,
            method: 'sms' as const,
            otpSent: true,
        };
    }

    @ApiBody({ schema: OtpVerifyPayload })
    @ApiResource(OtpVerifyResponse)
    @Post('otp/verify')
    async verifyOtp(@Body() body: Static<typeof OtpVerifyPayload>) {
        const result = await this.otpService.verifyOtp({
            mobilenumber: body.mobilenumber,
            code: body.otp,
        });
        if (result.status !== 'approved') {
            return {
                verified: false,
            };
        }
        const user = await this.datasource.manager.findOne(UserEntity, {
            where: { mobilenumber: body.mobilenumber },
            relations: {
                roles: true,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.active) {
            throw new UnauthorizedException('Your account has been deactivated. Please contact administrator.');
        }
        const tokens = await this.tokenService.generateTokens({
            id: user.id,
            mobileNumber: user.mobilenumber,
            roles: user.roles.map((role) => role.name),
        });
        return {
            verified: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
}
