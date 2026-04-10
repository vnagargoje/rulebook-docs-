import { InternalServerErrorException } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as entities from '@yugo/nestjs-database/entities';
import { resolve } from 'path';

export const databaseConfig = registerAs(
    'database.config',
    (): TypeOrmModuleOptions => {
        const env = process.env;
        if (!env['DATABASE_MIGRATIONS_DIR']) {
            throw new InternalServerErrorException(
                'DATABASE_MIGRATIONS_DIR is not set',
            );
        }
        return {
            type: 'mysql',
            url: env['DATABASE_MASTER_URL'],
            database: env['DATABASE_NAME'] ?? 'yugo',
            migrationsRun: false,
            synchronize: false,
            dropSchema: false,
            timezone: 'Z',
            connectorPackage: 'mysql2',
            manualInitialization: true,
            entities: Object.values(entities),
            migrations: [
                resolve(env['DATABASE_MIGRATIONS_DIR'], '**/*.{js,ts}'),
            ],
            charset: 'utf8mb4_unicode_ci',
        };
    },
);
