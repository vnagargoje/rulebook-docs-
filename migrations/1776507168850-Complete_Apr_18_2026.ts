import type { MigrationInterface, QueryRunner } from "typeorm";

export class completeApr_18_20261776507168850 implements MigrationInterface {
    name = 'completeApr_18_20261776507168850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`countries\` (\`code\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`states\` (\`id\` varchar(26) NOT NULL, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`latitude\` decimal(10,8) NULL, \`longitude\` decimal(11,8) NULL, \`countryCode\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cities\` (\`id\` varchar(26) NOT NULL, \`name\` varchar(255) NOT NULL, \`latitude\` decimal(10,8) NULL, \`longitude\` decimal(11,8) NULL, \`stateId\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`name\` varchar(255) NOT NULL, PRIMARY KEY (\`name\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_kycs\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`documentId\` varchar(255) NOT NULL, \`type\` enum ('aadhar', 'pan', 'driving_license') NOT NULL, \`status\` enum ('pending', 'approved', 'rejected', 'verified') NOT NULL DEFAULT 'pending', \`verifiedAt\` datetime NULL, \`notes\` text NULL, \`userId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`files\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`filename\` varchar(255) NULL, \`path\` varchar(255) NOT NULL, \`mimeType\` varchar(255) NULL, \`size\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`batteries\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`batteryId\` varchar(255) NOT NULL, \`gpsId\` varchar(255) NULL, \`properties\` json NULL, \`qrCodeId\` varchar(255) NULL, \`stationId\` varchar(255) NULL, UNIQUE INDEX \`IDX_80c9709f1e1240d98c38d4353c\` (\`batteryId\`), UNIQUE INDEX \`REL_f575b49083c8ddf1c92f79fc30\` (\`qrCodeId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vehicles\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`vehicleNumber\` varchar(255) NULL, \`rcNumber\` varchar(255) NULL, \`chassisNumber\` varchar(255) NULL, \`gpsId\` varchar(255) NULL, \`properties\` json NULL, \`stationId\` varchar(255) NULL, UNIQUE INDEX \`IDX_6165f51ba0c8c31b6ab41838e3\` (\`vehicleNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stations\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` enum ('swap_station', 'hub_station') NOT NULL, \`name\` varchar(255) NOT NULL, \`latitude\` decimal(10,8) NULL, \`longitude\` decimal(11,8) NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`addressId\` varchar(255) NULL, \`managerId\` varchar(255) NULL, UNIQUE INDEX \`REL_d077f78e3da856a69763bb467c\` (\`addressId\`), INDEX \`IDX_ee84d76806d2dbd975c7708efc\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`email\` varchar(255) NULL, \`mobilenumber\` varchar(255) NULL, \`password\` varchar(255) NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`dateOfBirth\` date NULL, \`gender\` enum ('male', 'female', 'other') NULL, \`properties\` json NULL, INDEX \`IDX_c65791a450647d236039188a07\` (\`email\`, \`mobilenumber\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_41823e592cca849bbb4c7e72a7\` (\`mobilenumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`addresses\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`lineOne\` varchar(255) NOT NULL, \`lineTwo\` varchar(255) NULL, \`pincode\` varchar(255) NOT NULL, \`cityId\` varchar(255) NULL, \`userId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plans\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(150) NOT NULL, \`description\` text NULL, \`validityDays\` int NOT NULL, \`kmLimit\` decimal(10,2) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`deposit\` decimal(10,2) NOT NULL, \`gst\` decimal(10,2) NOT NULL DEFAULT '0.00', \`registrationFee\` decimal(10,2) NOT NULL DEFAULT '0.00', \`totalAmount\` decimal(10,2) AS (price + deposit + gst + registrationFee) VIRTUAL NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`INSERT INTO \`yugo\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["yugo","plans","GENERATED_COLUMN","totalAmount","price + deposit + gst + registrationFee"]);
        await queryRunner.query(`CREATE TABLE \`top_ups\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(150) NOT NULL, \`description\` text NULL, \`validityDays\` int NOT NULL, \`kmLimit\` decimal(10,2) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`gst\` decimal(10,2) NOT NULL DEFAULT '0.00', \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_top_ups\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` varchar(255) NOT NULL, \`userPlanId\` varchar(255) NOT NULL, \`topUpId\` varchar(255) NOT NULL, \`topUpSnapshot\` json NOT NULL, \`appliedAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_plans\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` varchar(255) NOT NULL, \`planId\` varchar(255) NOT NULL, \`planSnapshot\` json NOT NULL, \`status\` enum ('purchased', 'failed', 'pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'active', \`startsAt\` datetime NULL, \`expiresAt\` datetime NULL, \`remainingKm\` decimal(10,2) NOT NULL, \`qrCodeId\` varchar(255) NULL, UNIQUE INDEX \`REL_a08e6a0f0c8f18adc7c7895013\` (\`qrCodeId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookings\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userPlanId\` varchar(255) NOT NULL, \`stationId\` varchar(255) NULL, \`vehicleId\` varchar(255) NULL, \`batteryId\` varchar(255) NULL, \`status\` enum ('inactive', 'draft', 'created', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'inactive', \`pickupOtp\` varchar(4) NOT NULL, UNIQUE INDEX \`IDX_6e9c1282d4cb4fe1980c4a4df4\` (\`userPlanId\`), UNIQUE INDEX \`REL_6e9c1282d4cb4fe1980c4a4df4\` (\`userPlanId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_roles_roles\` (\`usersId\` varchar(26) NOT NULL, \`rolesName\` varchar(255) NOT NULL, INDEX \`IDX_df951a64f09865171d2d7a502b\` (\`usersId\`), INDEX \`IDX_9fc16941d812c4d99e9eb6c279\` (\`rolesName\`), PRIMARY KEY (\`usersId\`, \`rolesName\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`states\` ADD CONSTRAINT \`FK_8077396702f265b2185404feb01\` FOREIGN KEY (\`countryCode\`) REFERENCES \`countries\`(\`code\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cities\` ADD CONSTRAINT \`FK_ded8a17cd090922d5bac8a2361f\` FOREIGN KEY (\`stateId\`) REFERENCES \`states\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_kycs\` ADD CONSTRAINT \`FK_e237665f5ad576312d4b13b5e0a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`batteries\` ADD CONSTRAINT \`FK_f575b49083c8ddf1c92f79fc308\` FOREIGN KEY (\`qrCodeId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`batteries\` ADD CONSTRAINT \`FK_890f35c05dd24b936a8bdea2b8f\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_203683541105ef9807708f0622d\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stations\` ADD CONSTRAINT \`FK_d077f78e3da856a69763bb467c0\` FOREIGN KEY (\`addressId\`) REFERENCES \`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stations\` ADD CONSTRAINT \`FK_aefda3151eae91995e6a98ad0d5\` FOREIGN KEY (\`managerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_221420cb636d4e9e48aeca528a0\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_95c93a584de49f0b0e13f753630\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD CONSTRAINT \`FK_75d12198dc2d6b3437e332f78dc\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD CONSTRAINT \`FK_25a2120cc9cb8c747709a45f60b\` FOREIGN KEY (\`userPlanId\`) REFERENCES \`user_plans\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` ADD CONSTRAINT \`FK_060a4ede88fe6a755181aff3996\` FOREIGN KEY (\`topUpId\`) REFERENCES \`top_ups\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` ADD CONSTRAINT \`FK_e7dfb1112dc2436d350d67f56d7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` ADD CONSTRAINT \`FK_4846c2fbd62da9a99cb2f5146a6\` FOREIGN KEY (\`planId\`) REFERENCES \`plans\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_plans\` ADD CONSTRAINT \`FK_a08e6a0f0c8f18adc7c7895013d\` FOREIGN KEY (\`qrCodeId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_6e9c1282d4cb4fe1980c4a4df40\` FOREIGN KEY (\`userPlanId\`) REFERENCES \`user_plans\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_4dfd5423c41bfb10974dd3b4c1d\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_30909e71d6dd969e95d995258f1\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_80e8bb89f3847bc22dfdf4869d9\` FOREIGN KEY (\`batteryId\`) REFERENCES \`batteries\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_df951a64f09865171d2d7a502b1\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_9fc16941d812c4d99e9eb6c2798\` FOREIGN KEY (\`rolesName\`) REFERENCES \`roles\`(\`name\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_9fc16941d812c4d99e9eb6c2798\``);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_df951a64f09865171d2d7a502b1\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_80e8bb89f3847bc22dfdf4869d9\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_30909e71d6dd969e95d995258f1\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_4dfd5423c41bfb10974dd3b4c1d\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_6e9c1282d4cb4fe1980c4a4df40\``);
        await queryRunner.query(`ALTER TABLE \`user_plans\` DROP FOREIGN KEY \`FK_a08e6a0f0c8f18adc7c7895013d\``);
        await queryRunner.query(`ALTER TABLE \`user_plans\` DROP FOREIGN KEY \`FK_4846c2fbd62da9a99cb2f5146a6\``);
        await queryRunner.query(`ALTER TABLE \`user_plans\` DROP FOREIGN KEY \`FK_e7dfb1112dc2436d350d67f56d7\``);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP FOREIGN KEY \`FK_060a4ede88fe6a755181aff3996\``);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP FOREIGN KEY \`FK_25a2120cc9cb8c747709a45f60b\``);
        await queryRunner.query(`ALTER TABLE \`user_top_ups\` DROP FOREIGN KEY \`FK_75d12198dc2d6b3437e332f78dc\``);
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_95c93a584de49f0b0e13f753630\``);
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_221420cb636d4e9e48aeca528a0\``);
        await queryRunner.query(`ALTER TABLE \`stations\` DROP FOREIGN KEY \`FK_aefda3151eae91995e6a98ad0d5\``);
        await queryRunner.query(`ALTER TABLE \`stations\` DROP FOREIGN KEY \`FK_d077f78e3da856a69763bb467c0\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_203683541105ef9807708f0622d\``);
        await queryRunner.query(`ALTER TABLE \`batteries\` DROP FOREIGN KEY \`FK_890f35c05dd24b936a8bdea2b8f\``);
        await queryRunner.query(`ALTER TABLE \`batteries\` DROP FOREIGN KEY \`FK_f575b49083c8ddf1c92f79fc308\``);
        await queryRunner.query(`ALTER TABLE \`user_kycs\` DROP FOREIGN KEY \`FK_e237665f5ad576312d4b13b5e0a\``);
        await queryRunner.query(`ALTER TABLE \`cities\` DROP FOREIGN KEY \`FK_ded8a17cd090922d5bac8a2361f\``);
        await queryRunner.query(`ALTER TABLE \`states\` DROP FOREIGN KEY \`FK_8077396702f265b2185404feb01\``);
        await queryRunner.query(`DROP INDEX \`IDX_9fc16941d812c4d99e9eb6c279\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_df951a64f09865171d2d7a502b\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`users_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`REL_6e9c1282d4cb4fe1980c4a4df4\` ON \`bookings\``);
        await queryRunner.query(`DROP INDEX \`IDX_6e9c1282d4cb4fe1980c4a4df4\` ON \`bookings\``);
        await queryRunner.query(`DROP TABLE \`bookings\``);
        await queryRunner.query(`DROP INDEX \`REL_a08e6a0f0c8f18adc7c7895013\` ON \`user_plans\``);
        await queryRunner.query(`DROP TABLE \`user_plans\``);
        await queryRunner.query(`DROP TABLE \`user_top_ups\``);
        await queryRunner.query(`DROP TABLE \`top_ups\``);
        await queryRunner.query(`DELETE FROM \`yugo\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","totalAmount","yugo","plans"]);
        await queryRunner.query(`DROP TABLE \`plans\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
        await queryRunner.query(`DROP INDEX \`IDX_41823e592cca849bbb4c7e72a7\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_c65791a450647d236039188a07\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee84d76806d2dbd975c7708efc\` ON \`stations\``);
        await queryRunner.query(`DROP INDEX \`REL_d077f78e3da856a69763bb467c\` ON \`stations\``);
        await queryRunner.query(`DROP TABLE \`stations\``);
        await queryRunner.query(`DROP INDEX \`IDX_6165f51ba0c8c31b6ab41838e3\` ON \`vehicles\``);
        await queryRunner.query(`DROP TABLE \`vehicles\``);
        await queryRunner.query(`DROP INDEX \`REL_f575b49083c8ddf1c92f79fc30\` ON \`batteries\``);
        await queryRunner.query(`DROP INDEX \`IDX_80c9709f1e1240d98c38d4353c\` ON \`batteries\``);
        await queryRunner.query(`DROP TABLE \`batteries\``);
        await queryRunner.query(`DROP TABLE \`files\``);
        await queryRunner.query(`DROP TABLE \`user_kycs\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`cities\``);
        await queryRunner.query(`DROP TABLE \`states\``);
        await queryRunner.query(`DROP TABLE \`countries\``);
    }
}
