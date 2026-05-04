import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs(
    'redis.config',
    (): RedisModuleOptions => {
        const env = process.env;
        return {
            config: {
                host: env['REDIS_HOST'] ?? '0.0.0.0',
                port: +(env['REDIS_PORT'] ?? '6379'),
                password: env['REDIS_PASSWORD'],
                tls: env['REDIS_SSL'] === 'true' ? {} : undefined,
            },
        };
    },
);
