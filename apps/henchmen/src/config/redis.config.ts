import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs(
    'redis.config',
    (): RedisModuleOptions => {
        const env = process.env;
        const protocol = env['NODE_ENV'] === 'production' ? 'rediss' : 'redis';
        return {
            config: {
                url: `${protocol}://:${env['REDIS_PASSWORD']}@${env['REDIS_HOST'] ?? '0.0.0.0'}:${env['REDIS_PORT'] ?? '6379'}`,
            },
        };
    },
);
