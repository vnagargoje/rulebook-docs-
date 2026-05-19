import type { MigrationInterface, QueryRunner } from "typeorm";

export class addVerifiedNameInKyc1779127309668 implements MigrationInterface {
    name = 'addVerifiedNameInKyc1779127309668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_kycs\` ADD \`verifiedName\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_kycs\` DROP COLUMN \`verifiedName\``);
    }
}
