import type { MigrationInterface, QueryRunner } from "typeorm";

export class plansTopupsBookings1776243633727 implements MigrationInterface {
    name = 'plansTopupsBookings1776243633727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`plans\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`expiresInDays\` int NOT NULL, \`kmLimit\` int NOT NULL, \`baseAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`gstAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`depositAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`totalAmount\` decimal(10,2) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_plans\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`status\` enum ('pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'pending', \`activatedAt\` datetime NULL, \`expiresAt\` datetime NULL, \`kmConsumed\` int NOT NULL DEFAULT '0', \`topUpKmTotal\` int NOT NULL DEFAULT '0', \`paymentStatus\` enum ('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending', \`snapshot\` json NULL, \`userId\` varchar(255) NOT NULL, \`planId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookings\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`status\` enum ('created', 'vehicle_assigned', 'pending', 'completed', 'cancelled', 'in_progress') NOT NULL DEFAULT 'created', \`vehicleAssignedAt\` datetime NULL, \`userPlanId\` varchar(255) NOT NULL, \`stationId\` varchar(255) NOT NULL, \`vehicleId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`top_ups\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`additionalKm\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`isActive\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_top_ups\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`additionalKm\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`paymentStatus\` enum ('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending', \`purchasedAt\` datetime NOT NULL, \`userPlanId\` varchar(255) NOT NULL, \`topUpId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_kycs\` CHANGE \`status\` \`status\` enum ('pending', 'approved', 'rejected', 'verified') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` ADD CONSTRAINT \`FK_e7dfb1112dc2436d350d67f56d7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` ADD CONSTRAINT \`FK_4846c2fbd62da9a99cb2f5146a6\` FOREIGN KEY (\`planId\`) REFERENCES \`plans\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_6e9c1282d4cb4fe1980c4a4df40\` FOREIGN KEY (\`userPlanId\`) REFERENCES \`user_plans\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_4dfd5423c41bfb10974dd3b4c1d\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_30909e71d6dd969e95d995258f1\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD CONSTRAINT \`FK_25a2120cc9cb8c747709a45f60b\` FOREIGN KEY (\`userPlanId\`) REFERENCES \`user_plans\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD CONSTRAINT \`FK_060a4ede88fe6a755181aff3996\` FOREIGN KEY (\`topUpId\`) REFERENCES \`top_ups\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP FOREIGN KEY \`FK_060a4ede88fe6a755181aff3996\``);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP FOREIGN KEY \`FK_25a2120cc9cb8c747709a45f60b\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_30909e71d6dd969e95d995258f1\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_4dfd5423c41bfb10974dd3b4c1d\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_6e9c1282d4cb4fe1980c4a4df40\``);
        await queryRunner.query(`ALTER TABLE \`user_plans\` DROP FOREIGN KEY \`FK_4846c2fbd62da9a99cb2f5146a6\``);
        await queryRunner.query(`ALTER TABLE \`user_plans\` DROP FOREIGN KEY \`FK_e7dfb1112dc2436d350d67f56d7\``);
        await queryRunner.query(`ALTER TABLE \`user_kycs\` CHANGE \`status\` \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`DROP TABLE \`user_top_ups\``);
        await queryRunner.query(`DROP TABLE \`top_ups\``);
        await queryRunner.query(`DROP TABLE \`bookings\``);
        await queryRunner.query(`DROP TABLE \`user_plans\``);
        await queryRunner.query(`DROP TABLE \`plans\``);
    }
}
