import type { MigrationInterface, QueryRunner } from 'typeorm'

export class completeApr_16_20261776499885766 implements MigrationInterface {
    name = 'completeApr_18_20261776499885766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('inactive', 'draft', 'created', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'inactive'`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('created', 'vehicle_assigned', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'created'`,
        )
    }
}
