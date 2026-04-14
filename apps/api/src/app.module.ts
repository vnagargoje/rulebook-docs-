import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import {
    databaseConfig,
    jwtConfig,
    loggerConfig,
    redisConfig,
} from './config/index.js';
import { AppAuthGuard } from './guards/app.guard.js';
import { TypeboxSerializerInterceptor } from './interceptors/typebox-serializer.interceptor.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CountryStateCitiesModule } from './modules/country-state-cities/country-state-cities.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { CaslModule } from '@yugo/nestjs-casl';
import { permissions } from '@yugo/permissions';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, jwtConfig, loggerConfig, redisConfig],
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.getOrThrow('logger.config'),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.getOrThrow('database.config'),
        }),
        RedisModule.forRootAsync({
            // @ts-expect-error
            useFactory: async (configService: ConfigService) =>
                configService.getOrThrow('redis.config'),
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return configService.getOrThrow('jwt.config');
            },
        }),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        CaslModule.forRoot({
            permissions,
        }),
        AuthModule,
        CountryStateCitiesModule,
        UsersModule,
    ],
    providers: [
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: AppAuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TypeboxSerializerInterceptor,
        },
    ],
})
export class AppModule {}
