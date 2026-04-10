import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
    CommandRunner,
    InquirerService,
    Option,
    SubCommand,
} from 'nest-commander';
import { DataSource } from 'typeorm';
import { SeederConstructor, SeederExecutor } from 'typeorm-extension';
import { CountryStateCitiesSeeder, RolesSeeder } from './seeders/index.js';

@SubCommand({ name: 'seed' })
export class SeedDbCommand extends CommandRunner {
    private readonly logger = new Logger(SeedDbCommand.name);
    constructor(
        private readonly inquirer: InquirerService,
        @InjectDataSource() private readonly datasource: DataSource,
    ) {
        super();
    }

    @Option({ flags: '--initial [boolean]' })
    parseInitial(b: any) {
        return Boolean(b);
    }

    async run(_passedParams: string[], options?: Record<string, any>) {
        const { initial = false } = options || {};
        try {
            let seeds: SeederConstructor[] = [
                RolesSeeder,
                CountryStateCitiesSeeder,
            ];

            if (!this.datasource.isInitialized) {
                await this.datasource.initialize();
            }

            if (!initial) {
                // @ts-ignore
                const inquirer = this.inquirer.inquirer as any;
                const { seeds: seedsAnswer } = await inquirer.prompt({
                    name: 'seeds',
                    type: 'checkbox',
                    choices: seeds.map((s) => s.name),
                    default: seeds.map((s) => s.name),
                });
                if (seedsAnswer.length) {
                    seeds = seeds.filter((s) => seedsAnswer.includes(s.name));
                } else {
                    this.logger.log('No seeders selected. Exiting.');
                    return;
                }
            }

            this.logger.log('Starting seeding...');
            const executor = new SeederExecutor(this.datasource);

            await executor.execute({
                seeds,
                seedTracking: false,
            });

            this.logger.log('Done seeding');
            await this.datasource.destroy();
        } catch (err) {
            this.logger.error('Error during seeding:', err);
            if (this.datasource.isInitialized) await this.datasource.destroy();
        }
    }
}
