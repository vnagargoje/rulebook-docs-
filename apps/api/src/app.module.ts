import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { databaseConfig, jwtConfig, loggerConfig, redisConfig } from './config';
import { AppAuthGuard } from './guards/app.guard.js';
import { TypeboxSerializerInterceptor } from './interceptors/typebox-serializer.interceptor.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CountryStateCitiesModule } from './modules/country-state-cities/country-state-cities.module.js';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

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
        AuthModule,
        CountryStateCitiesModule,
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
