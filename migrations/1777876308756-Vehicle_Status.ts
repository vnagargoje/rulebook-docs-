import type { MigrationInterface, QueryRunner } from "typeorm";

export class vehicleStatus1777876308756 implements MigrationInterface {
    name = 'vehicleStatus1777876308756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD \`status\` enum ('in_use', 'available', 'unavailable') NOT NULL DEFAULT 'available'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP COLUMN \`status\``);
    }
}
