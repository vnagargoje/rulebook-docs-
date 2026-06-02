import type { MigrationInterface, QueryRunner } from "typeorm";

export class underMaintainanceBatteryVehicle1780393327437 implements MigrationInterface {
    name = 'underMaintainanceBatteryVehicle1780393327437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`batteries\` CHANGE \`status\` \`status\` enum ('available', 'charged', 'charging', 'drained', 'in_transit', 'in_use', 'under_maintenance') NOT NULL DEFAULT 'available'`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`status\` \`status\` enum ('in_use', 'available', 'unavailable', 'under_maintenance') NOT NULL DEFAULT 'available'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`status\` \`status\` enum ('in_use', 'available', 'unavailable') NOT NULL DEFAULT 'available'`);
        await queryRunner.query(`ALTER TABLE \`batteries\` CHANGE \`status\` \`status\` enum ('available', 'charged', 'charging', 'drained', 'in_transit', 'in_use') NOT NULL DEFAULT 'available'`);
    }
}
