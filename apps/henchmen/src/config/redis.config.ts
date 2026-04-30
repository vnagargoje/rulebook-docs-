import { registerAs } from '@nestjs/config';
import { RedisModuleOptions } from '@nestjs-redis/kit';

export const redisConfig = registerAs(
    'redis.config',
    (): RedisModuleOptions => {
        const env = process.env;
        const tls: boolean = (env['REDIS_SSL'] as string) === 'true';
        return {
            type: 'client',
            options: {
                username: 'default',
                password: env['REDIS_PASSWORD'],
                socket: {
                    host: env['REDIS_HOST'],
                    port: +(env['REDIS_PORT'] ?? '6379'),
                    tls: tls as any,
                },
            },
        };
    },
);
