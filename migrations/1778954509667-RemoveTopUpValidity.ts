import type { MigrationInterface, QueryRunner } from "typeorm";

export class removeTopUpValidity1778954509667 implements MigrationInterface {
    name = 'removeTopUpValidity1778954509667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`top_ups\` DROP COLUMN \`validityDays\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`top_ups\` ADD \`validityDays\` int NOT NULL`);
    }
}
