import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsInngestModule } from '@yugo/nestjs-inngest';
import { LoggerModule } from 'nestjs-pino';
import {
    databaseConfig,
    inngestConfig,
    loggerConfig,
    moovingConfig,
    redisConfig,
    s3BucketConfig,
    s3ClientConfig,
} from './config';
import { AuthFunctions } from './functions/auth.functions.js';
import { BatteryFunctions } from './functions/battery.functions';
import { UserPlanFunctions } from './functions/user-plan.functions';
import { QueuedPlansSyncService } from './services/queued-plans-sync.service';

import { CqrsModule } from '@nestjs/cqrs';
import { ActivateQueuedPlanHandler } from '@yugo/cqrs';

@Module({
    imports: [
        CqrsModule.forRoot({}),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                loggerConfig,
                redisConfig,
                inngestConfig,
                moovingConfig,
                s3BucketConfig,
                s3ClientConfig,
            ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.getOrThrow('database.config'),
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(...args) {
                const [configService] = args as [ConfigService];
                return configService.getOrThrow('redis.config');
            },
        }),
        NestjsInngestModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return configService.getOrThrow('inngest.config');
            },
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return configService.getOrThrow('logger.config');
            },
        }),
    ],
    providers: [
        AuthFunctions,
        BatteryFunctions,
        UserPlanFunctions,
        QueuedPlansSyncService,
        ActivateQueuedPlanHandler,
    ],
})
export class HenchmenModule {}
