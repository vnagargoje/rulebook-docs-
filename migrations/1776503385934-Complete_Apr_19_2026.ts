import type { MigrationInterface, QueryRunner } from "typeorm";

export class completeApr_19_20261776503385934 implements MigrationInterface {
    name = 'completeApr_19_20261776503385934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_4dfd5423c41bfb10974dd3b4c1d\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`stationId\` \`stationId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_4dfd5423c41bfb10974dd3b4c1d\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_4dfd5423c41bfb10974dd3b4c1d\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`stationId\` \`stationId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_4dfd5423c41bfb10974dd3b4c1d\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
