import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface TokenPayload {
    id: string;
    email?: string;
    mobileNumber?: string;
    roles?: string[];
}

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateAccessToken(payload: TokenPayload) {
        return this.jwtService.signAsync(payload, {
            expiresIn: '1h',
        });
    }

    async generateRefreshToken(payload: TokenPayload) {
        return this.jwtService.signAsync(payload, {
            expiresIn: '7d',
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
