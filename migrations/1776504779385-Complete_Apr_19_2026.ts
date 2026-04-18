import type { MigrationInterface, QueryRunner } from "typeorm";

export class completeApr_19_20261776504779385 implements MigrationInterface {
    name = 'completeApr_19_20261776504779385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_plans\` CHANGE \`status\` \`status\` enum ('purchased', 'failed', 'pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_plans\` CHANGE \`status\` \`status\` enum ('pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'active'`);
    }
}
