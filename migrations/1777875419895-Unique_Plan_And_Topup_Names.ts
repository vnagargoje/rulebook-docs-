import type { MigrationInterface, QueryRunner } from "typeorm";

export class uniquePlanAndTopupNames1777875419895 implements MigrationInterface {
    name = 'uniquePlanAndTopupNames1777875419895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plans\` ADD UNIQUE INDEX \`IDX_253d25dae4c94ee913bc5ec485\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`top_ups\` ADD UNIQUE INDEX \`IDX_941d8639a884218b46ae74c8a8\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`top_ups\` DROP INDEX \`IDX_941d8639a884218b46ae74c8a8\``);
        await queryRunner.query(`ALTER TABLE \`plans\` DROP INDEX \`IDX_253d25dae4c94ee913bc5ec485\``);
    }
}
