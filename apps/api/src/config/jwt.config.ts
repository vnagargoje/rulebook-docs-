import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { StringValue } from 'ms';

export const jwtConfig = registerAs('jwt.config', (): JwtModuleOptions => {
    const secret =
        process.env['JWT_SECRET'] ||
        randomBytes(Math.ceil(32 / 2))
            .toString('hex')
            .slice(0, 32);
    return {
        secret,
        signOptions: {
            expiresIn: (process.env['JWT_EXPIRES_IN'] as StringValue) || '15m',
        },
    };
});
