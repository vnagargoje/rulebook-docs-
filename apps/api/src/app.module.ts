import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { CqrsModule } from '@nestjs/cqrs';
import {
    databaseConfig,
    jwtConfig,
    loggerConfig,
    redisConfig,
    deepvueConfig,
    razorpayConfig,
    s3ClientConfig,
    s3BucketConfig,
} from './config';
import { AppAuthGuard } from './guards/app.guard.js';
import { TypeboxSerializerInterceptor } from './interceptors/typebox-serializer.interceptor.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { BookingsModule } from './modules/bookings/bookings.module.js';
import { CountryStateCitiesModule } from './modules/country-state-cities/country-state-cities.module.js';
import { PlansModule } from './modules/plans/plans.module.js';
import { TopUpsModule } from './modules/top-ups/top-ups.module.js';
import { UserPlansModule } from './modules/user-plans/user-plans.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { CaslModule } from '@yugo/nestjs-casl';
import { permissions } from '@yugo/permissions';
import { KycModule } from './modules/kyc/kyc.module.js';
import { JwtStrategy } from './strategies/jwt.strategy';
import { StationsModule } from './modules/stations/stations.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { BatteriesModule } from './modules/batteries/batteries.module';
import { BatteryTransportsModule } from './modules/battery-transports/battery-transports.module';
import { BatterySwapsModule } from './modules/battery-swaps/battery-swaps.module';
import { SurrendersModule } from './modules/surrenders/surrenders.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
    imports: [
        CqrsModule.forRoot({}),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                jwtConfig,
                loggerConfig,
                redisConfig,
                deepvueConfig,
                razorpayConfig,
                s3ClientConfig,
                s3BucketConfig,
            ],
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
        KycModule,
        CountryStateCitiesModule,
        UsersModule,
        PlansModule,
        TopUpsModule,
        UserPlansModule,
        BookingsModule,
        StationsModule,
        VehiclesModule,
        BatteriesModule,
        BatterySwapsModule,
        BatteryTransportsModule,
        SurrendersModule,
        TransactionsModule,
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
