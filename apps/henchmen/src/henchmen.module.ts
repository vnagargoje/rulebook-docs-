import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatteryEntity } from '@yugo/nestjs-database/entities';
import { NestjsInngestModule } from '@yugo/nestjs-inngest';
import { LoggerModule } from 'nestjs-pino';
import {
    databaseConfig,
    inngestConfig,
    loggerConfig,
    moovingConfig,
    redisConfig,
} from './config';
import { AuthFunctions } from './functions/auth.functions.js';
import { BatteryFunctions } from './functions/battery.functions';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                loggerConfig,
                redisConfig,
                inngestConfig,
                moovingConfig,
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
    providers: [AuthFunctions, BatteryFunctions],
})
export class HenchmenModule {}
