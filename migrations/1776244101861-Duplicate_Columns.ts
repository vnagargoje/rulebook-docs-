import type { MigrationInterface, QueryRunner } from "typeorm";

export class duplicateColumns1776244101861 implements MigrationInterface {
    name = 'duplicateColumns1776244101861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP COLUMN \`additionalKm\``);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP COLUMN \`amount\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD \`amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD \`additionalKm\` int NOT NULL`);
    }
}
