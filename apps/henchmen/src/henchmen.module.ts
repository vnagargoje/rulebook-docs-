import { RedisModule } from '@nestjs-redis/kit';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsInngestModule } from '@yugo/nestjs-inngest';
import { LoggerModule } from 'nestjs-pino';
import {
    databaseConfig,
    inngestConfig,
    loggerConfig,
    redisConfig,
} from './config';
import { AuthFunctions } from './functions/auth.functions.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, loggerConfig, redisConfig, inngestConfig],
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
            isGlobal: true,
            useFactory(configService: ConfigService) {
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
    providers: [AuthFunctions],
})
export class HenchmenModule {}
