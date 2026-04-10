import { InjectDataSource } from '@nestjs/typeorm';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@SubCommand({ name: 'migrations:run' })
export class MigrationRunCommand extends CommandRunner {
    private readonly logger = new Logger(MigrationRunCommand.name);
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {
        super();
    }

    @Option({ flags: '--fake [boolean]' })
    parseFake(value: any) {
        return Boolean(value);
    }

    @Option({ flags: '--transaction [string]' })
    parseTx(value: any) {
        return value;
    }

    async run(passedParams: string[], options?: Record<string, any>) {
        try {
            const { transaction, fake } = options || {};
            if (!this.dataSource.isInitialized) {
                this.dataSource.setOptions({
                    subscribers: [],
                    logging: ['query', 'error', 'schema'],
                });
                await this.dataSource.initialize();
            }

            const _options = {
                transaction: transaction || 'all',
                fake: !!fake,
            };

            await this.dataSource.runMigrations(_options as any);
            await this.dataSource.destroy();
            this.logger.log('Migrations run successfully');
        } catch (err) {
            this.logger.error('Error during migration run:', err);
            if (this.dataSource && this.dataSource.isInitialized) {
                await this.dataSource.destroy();
            }
        }
    }
}
