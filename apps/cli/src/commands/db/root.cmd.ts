import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { Command, CommandRunner, SubCommand } from 'nest-commander';
import { DataSource } from 'typeorm';
import { createDatabase, dropDatabase } from 'typeorm-extension';
import { MigrationGenerateCommand } from './migrations/generate.cmd.js';
import { MigrationRunCommand } from './migrations/run.cmd.js';
import { SeedDbCommand } from './seed.cmd.js';

@SubCommand({ name: 'init' })
export class DbInitCliCommand extends CommandRunner {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        super();
    }
    async run(passedParams: string[], options?: Record<string, any>) {
        try {
            await dropDatabase(this.datasource);
            console.log('database dropped');
        } catch (e) {
            console.log('database does not exist, skipping drop');
        }
        await createDatabase({
            options: this.datasource.options,
            synchronize: false,
        });
        console.log('created database');
        process.exit(0);
    }
}

@SubCommand({ name: 'drop' })
export class DropDbCommand extends CommandRunner {
    private readonly logger = new Logger(DropDbCommand.name);
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {
        super();
    }

    async run(passedParams: string[], options?: Record<string, any>) {
        try {
            this.dataSource.setOptions({
                logging: ['query', 'error'],
            });
            await this.dataSource.initialize();
            await this.dataSource.dropDatabase();
            await this.dataSource.destroy();
        } catch (err) {
            this.logger.error('Error while dropping the database', err);

            if (this.dataSource && this.dataSource.isInitialized)
                await this.dataSource.destroy();
        }
    }
}

@Command({
    name: 'db',
    description: 'Database operations',
    subCommands: [
        MigrationRunCommand,
        MigrationGenerateCommand,
        SeedDbCommand,
        DbInitCliCommand,
        DropDbCommand,
    ],
})
export class DbRootCommand extends CommandRunner {
    async run(): Promise<void> {
        console.log(
            'Use one of the subcommands: migrations:run, migrations:generate, seed, init, drop',
        );
    }
}
