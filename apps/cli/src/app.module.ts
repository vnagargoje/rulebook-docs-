import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationGenerateCommand } from './commands/db/migrations/generate.cmd.js';
import { MigrationRunCommand } from './commands/db/migrations/run.cmd.js';
import {
    DbInitCliCommand,
    DbRootCommand,
    DropDbCommand,
} from './commands/db/root.cmd.js';
import { SeedDbCommand } from './commands/db/seed.cmd.js';
import { databaseConfig } from './config/database.config.js';
import { SampleCommand } from './sample.command.js';

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
    ],
    providers: [
        SampleCommand,
        DbRootCommand,
        MigrationRunCommand,
        MigrationGenerateCommand,
        SeedDbCommand,
        DbInitCliCommand,
        DropDbCommand,
    ],
})
export class AppModule {}
