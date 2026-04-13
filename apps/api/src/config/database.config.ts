import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as entities from '@yugo/nestjs-database/entities';

export const databaseConfig = registerAs(
    'database.config',
    (): TypeOrmModuleOptions => {
        const env = process.env;
        return {
            type: 'mysql',
            database: env['DATABASE_NAME'] ?? 'yugo',
            charset: 'utf8mb4_unicode_ci',
            connectorPackage: 'mysql2',
            entities: Object.values(entities),
            synchronize: false,
            url: process.env['DATABASE_MASTER_URL'],
        };
    },
);
