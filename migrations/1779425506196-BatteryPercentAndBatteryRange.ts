import type { MigrationInterface, QueryRunner } from "typeorm";

export class batteryPercentAndBatteryRange1779425506196 implements MigrationInterface {
    name = 'batteryPercentAndBatteryRange1779425506196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`batteries\` ADD \`range\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` ADD \`batteryPercentAtTimeOfSwap\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_plans\` DROP COLUMN \`batteryPercentAtTimeOfSwap\``);
        await queryRunner.query(`ALTER TABLE \`batteries\` DROP COLUMN \`range\``);
    }
}
