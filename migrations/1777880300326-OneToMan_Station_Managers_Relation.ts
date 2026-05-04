import type { MigrationInterface, QueryRunner } from "typeorm";

export class oneToManStationManagersRelation1777880300326 implements MigrationInterface {
    name = 'oneToManStationManagersRelation1777880300326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stations\` DROP FOREIGN KEY \`FK_aefda3151eae91995e6a98ad0d5\``);
        await queryRunner.query(`ALTER TABLE \`stations\` DROP COLUMN \`managerId\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`stationId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD \`status\` enum ('awaiting', 'applied', 'failed') NOT NULL DEFAULT 'awaiting'`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` ADD \`totalKm\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`userTopUpId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` CHANGE \`topUpSnapshot\` \`topUpSnapshot\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` CHANGE \`appliedAt\` \`appliedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` CHANGE \`status\` \`status\` enum ('purchased', 'failed', 'pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_94754bc4f5522eee5c245371906\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_554a7b075c0b0efb6d6fecc0d0c\` FOREIGN KEY (\`userTopUpId\`) REFERENCES \`user_top_ups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_554a7b075c0b0efb6d6fecc0d0c\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_94754bc4f5522eee5c245371906\``);
        await queryRunner.query(`ALTER TABLE \`user_plans\` CHANGE \`status\` \`status\` enum ('purchased', 'failed', 'pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` CHANGE \`appliedAt\` \`appliedAt\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` CHANGE \`topUpSnapshot\` \`topUpSnapshot\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`userTopUpId\``);
        await queryRunner.query(`ALTER TABLE \`user_plans\` DROP COLUMN \`totalKm\``);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`stationId\``);
        await queryRunner.query(`ALTER TABLE \`stations\` ADD \`managerId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`stations\` ADD CONSTRAINT \`FK_aefda3151eae91995e6a98ad0d5\` FOREIGN KEY (\`managerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
}
