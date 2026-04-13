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
import {
    CountryStateCitiesSeeder,
    DummyDataSeeder,
    RolesSeeder,
} from './seeders/index.js';

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

    @Option({ flags: '--dummy-data [boolean]' })
    parseDummyData(b: any) {
        return Boolean(b);
    }

    async run(_passedParams: string[], options?: Record<string, any>) {
        const { initial = false, dummyData = false } = options || {};
        try {
            const initialSeeds: SeederConstructor[] = [
                RolesSeeder,
                CountryStateCitiesSeeder,
            ];
            const dummyDataSeeds: SeederConstructor[] = [
                RolesSeeder,
                DummyDataSeeder,
            ];
            const allSeeds: SeederConstructor[] = [
                RolesSeeder,
                CountryStateCitiesSeeder,
                DummyDataSeeder,
            ];
            let seeds: SeederConstructor[] = allSeeds;

            if (!this.datasource.isInitialized) {
                await this.datasource.initialize();
            }

            if (initial || dummyData) {
                seeds = [];

                if (initial) {
                    seeds.push(...initialSeeds);
                }

                if (dummyData) {
                    for (const seed of dummyDataSeeds) {
                        if (!seeds.includes(seed)) {
                            seeds.push(seed);
                        }
                    }
                }
            } else {
                // @ts-ignore
                const inquirer = this.inquirer.inquirer as any;
                const { seeds: seedsAnswer } = await inquirer.prompt({
                    name: 'seeds',
                    type: 'checkbox',
                    choices: allSeeds.map((s) => s.name),
                    default: allSeeds.map((s) => s.name),
                });
                if (seedsAnswer.length) {
                    seeds = allSeeds.filter((s) => seedsAnswer.includes(s.name));
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
