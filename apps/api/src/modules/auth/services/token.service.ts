import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

export interface TokenPayload {
    id: string;
    email?: string;
    mobileNumber?: string;
    roles?: string[];
}

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateAccessToken(payload: TokenPayload) {
        return this.jwtService.signAsync(payload, {
            expiresIn:
                (this.configService.get<string>(
                    'JWT_EXPIRES_IN',
                ) as StringValue) || '180d',
        });
    }

    async generateRefreshToken(payload: TokenPayload) {
        return this.jwtService.signAsync(payload, {
            expiresIn:
                (this.configService.get<string>(
                    'JWT_REFRESH_EXPIRES_IN',
                ) as StringValue) || '365d',
        });
    }

    async generateTokens(payload: TokenPayload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
