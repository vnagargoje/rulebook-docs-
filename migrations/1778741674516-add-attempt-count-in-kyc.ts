import type { MigrationInterface, QueryRunner } from "typeorm";

export class addAttemptCountInKyc1778741674516 implements MigrationInterface {
    name = 'addAttemptCountInKyc1778741674516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_kycs\` ADD \`attemptCount\` int UNSIGNED NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_kycs\` DROP COLUMN \`attemptCount\``);
    }
}
