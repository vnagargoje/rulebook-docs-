import { ApiResource } from '@/decorators/api-resource.decorator.js';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator.js';
import { AppAuthGuard } from '@/guards/app.guard.js';
import { type ContextUserType } from '@/types/context-user.js';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { type Static } from '@sinclair/typebox';
import {
    AadhaarGenerateOtpCommand,
    AadhaarReloadCaptchaCommand,
    AadhaarStartSessionCommand,
    AadhaarVerifyOtpCommand,
} from '@yugo/cqrs';
import {
    AadhaarGenerateOtpPayload,
    AadhaarVerifyOtpPayload,
} from '../../dtos/payloads.js';
import {
    AadhaarConnectResponse,
    AadhaarReloadCaptchaResponse,
    GenericKycResponse,
} from '../../dtos/responses.js';

@ApiTags('kyc')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'kyc/aadhaar', version: '1' })
export class AadhaarController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiResource(AadhaarConnectResponse)
    @Get('connect')
    async connect() {
        return this.commandBus.execute(new AadhaarStartSessionCommand());
    }

    @ApiBody({ schema: AadhaarGenerateOtpPayload })
    @ApiResource(GenericKycResponse)
    @Post('generate/otp')
    async generateOtp(
        @AuthenticatedUser() user: ContextUserType,
        @Body() body: Static<typeof AadhaarGenerateOtpPayload>,
    ) {
        return this.commandBus.execute(
            new AadhaarGenerateOtpCommand(user.id, body),
        );
    }

    @ApiBody({ schema: AadhaarVerifyOtpPayload })
    @ApiResource(GenericKycResponse)
    @Post('verify/otp')
    async verifyOtp(
        @AuthenticatedUser() user: ContextUserType,
        @Body() body: Static<typeof AadhaarVerifyOtpPayload>,
    ) {
        return this.commandBus.execute(
            new AadhaarVerifyOtpCommand(user.id, body),
        );
    }

    @ApiResource(AadhaarReloadCaptchaResponse)
    @Get('reload-captcha')
    async reloadCaptcha(@Query('sessionId') sessionId: string) {
        return this.commandBus.execute(
            new AadhaarReloadCaptchaCommand(sessionId),
        );
    }
}
