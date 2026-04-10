import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { format } from '@sqltools/formatter/lib/sqlFormatter.js';
import chalk from 'chalk';
// @ts-ignore
import { camelCase } from 'change-case-all';
import { mkdir, writeFile } from 'fs/promises';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { basename, dirname, resolve } from 'path';
import { DataSource } from 'typeorm';

@SubCommand({ name: 'migrations:generate', arguments: '<path>' })
export class MigrationGenerateCommand extends CommandRunner {
    private readonly logger = new Logger(MigrationGenerateCommand.name);
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {
        super();
    }

    @Option({ flags: '--timestamp [number]' })
    parseTimestamp(timestamp: any) {
        return timestamp ? new Date(Number(timestamp)).getTime() : Date.now();
    }

    @Option({ flags: '--pretty [boolean]' })
    parsePretty(p: any) {
        return Boolean(p);
    }

    @Option({ flags: '--dry [boolean]' })
    parseDryRun(p: any) {
        return Boolean(p);
    }

    private escapeTemplateLiteral(value: string): string {
        if (value == null) {
            return '';
        }
        return value
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$\{/g, '\\${');
    }

    async run(passedParams: string[], options?: Record<string, any>) {
        let [path] = passedParams;
        const migrationsDir = resolve(process.cwd(), '../../migrations');
        const fullPath = resolve(migrationsDir, path);
        const {
            timestamp = Date.now(),
            pretty = false,
            dry: dryrun = false,
        } = options || {};
        const filename = `${timestamp}-${basename(path)}.ts`;

        try {
            if (!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
            }

            const sqlInMemory = await this.dataSource.driver
                .createSchemaBuilder()
                .log();
            const upSqls: string[] = [];
            const downSqls: string[] = [];

            sqlInMemory.upQueries.forEach((upQuery) => {
                let query = upQuery.query;
                if (pretty) query = this.prettifyQuery(query);
                upSqls.push(
                    `        await queryRunner.query(\`${this.escapeTemplateLiteral(query)}\`${this.queryParams(upQuery.parameters)});`,
                );
            });

            sqlInMemory.downQueries.forEach((downQuery) => {
                let query = downQuery.query;
                if (pretty) query = this.prettifyQuery(query);
                downSqls.push(
                    `        await queryRunner.query(\`${this.escapeTemplateLiteral(query)}\`${this.queryParams(downQuery.parameters)});`,
                );
            });

            await this.dataSource.destroy();

            if (!upSqls.length) {
                this.logger.log(
                    chalk.yellow('No changes in database schema were found.'),
                );
                return;
            }

            const fileContent = this.getTemplate(
                basename(path),
                timestamp,
                upSqls,
                downSqls.reverse(),
            );

            if (dryrun) {
                this.logger.log(
                    chalk.green(
                        `Dry run: Migration would have content:\n\n${fileContent}`,
                    ),
                );
            } else {
                const migrationFileName = resolve(migrationsDir, filename);
                await mkdir(migrationsDir, { recursive: true });
                await writeFile(migrationFileName, fileContent);
                this.logger.log(
                    chalk.green(
                        `Migration ${chalk.blue(migrationFileName)} has been generated successfully.`,
                    ),
                );
            }
        } catch (err) {
            this.logger.error('Error during migration generation:', err);
            if (this.dataSource.isInitialized) await this.dataSource.destroy();
        }
    }

    protected queryParams(parameters: any[] | undefined): string {
        return parameters && parameters.length
            ? `, ${JSON.stringify(parameters)}`
            : '';
    }

    protected getTemplate(
        name: string,
        timestamp: number,
        upSqls: string[],
        downSqls: string[],
    ): string {
        const migrationName = `${camelCase(name)}${timestamp}`;
        return `import type { MigrationInterface, QueryRunner } from "typeorm";

export class ${migrationName} implements MigrationInterface {
    name = '${migrationName}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join('\n')}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.join('\n')}
    }
}
`;
    }

    protected prettifyQuery(query: string) {
        const formattedQuery = format(query, { indent: '    ' });
        return (
            '\n' + formattedQuery.replace(/^/gm, '            ') + '\n        '
        );
    }
}
