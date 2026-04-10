import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config.js';
import { AppAuthGuard } from './guards/app.guard.js';
import { TypeboxSerializerInterceptor } from './interceptors/typebox-serializer.interceptor.js';
import { CountryStateCitiesModule } from './modules/country-state-cities/country-state-cities.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.getOrThrow('database.config'),
        }),
        CountryStateCitiesModule,
    ],
    providers: [
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
