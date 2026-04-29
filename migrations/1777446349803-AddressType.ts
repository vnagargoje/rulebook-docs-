import type { MigrationInterface, QueryRunner } from "typeorm";

export class addressType1777446349803 implements MigrationInterface {
    name = 'addressType1777446349803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD \`type\` enum ('current', 'permanent') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP COLUMN \`type\``);
    }
}
