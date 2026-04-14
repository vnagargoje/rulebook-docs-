import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MockOtpService } from './services/mock-otp.service.js';
import { TokenService } from './services/token.service.js';
import { OTP_SERVICE } from './constants.js';
import { V1AuthController } from './controllers/v1/auth.controller.js';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret:
                    configService.get<string>('JWT_SECRET') || 'dev-secret-key',
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    controllers: [V1AuthController],
    providers: [
        TokenService,
        {
            provide: OTP_SERVICE,
            useClass: MockOtpService,
        },
    ],
})
export class AuthModule {}
