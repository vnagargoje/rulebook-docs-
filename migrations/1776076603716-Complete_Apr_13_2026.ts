import type { MigrationInterface, QueryRunner } from "typeorm";

export class completeApr_13_20261776076603716 implements MigrationInterface {
    name = 'completeApr_13_20261776076603716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_kycs\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`documentId\` varchar(255) NOT NULL, \`type\` enum ('aadhar', 'pan', 'driving_license') NOT NULL, \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', \`verifiedAt\` datetime NULL, \`notes\` text NULL, \`userId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`files\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`filename\` varchar(255) NULL, \`path\` varchar(255) NOT NULL, \`mimeType\` varchar(255) NULL, \`size\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`batteries\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`batteryId\` varchar(255) NOT NULL, \`gpsId\` varchar(255) NULL, \`properties\` json NULL, \`qrCodeId\` varchar(255) NULL, \`stationId\` varchar(255) NULL, UNIQUE INDEX \`IDX_80c9709f1e1240d98c38d4353c\` (\`batteryId\`), UNIQUE INDEX \`REL_f575b49083c8ddf1c92f79fc30\` (\`qrCodeId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vehicles\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`vehicleNumber\` varchar(255) NULL, \`rcNumber\` varchar(255) NULL, \`chassisNumber\` varchar(255) NULL, \`gpsId\` varchar(255) NULL, \`properties\` json NULL, \`stationId\` varchar(255) NULL, UNIQUE INDEX \`IDX_6165f51ba0c8c31b6ab41838e3\` (\`vehicleNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stations\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` enum ('swap_station', 'hub_station') NOT NULL, \`name\` varchar(255) NOT NULL, \`latitude\` decimal(10,8) NULL, \`longitude\` decimal(11,8) NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`addressId\` varchar(255) NULL, \`managerId\` varchar(255) NULL, UNIQUE INDEX \`REL_d077f78e3da856a69763bb467c\` (\`addressId\`), INDEX \`IDX_ee84d76806d2dbd975c7708efc\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`addresses\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`lineOne\` varchar(255) NOT NULL, \`lineTwo\` varchar(255) NULL, \`pincode\` varchar(255) NOT NULL, \`cityId\` varchar(255) NULL, \`userId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`dateOfBirth\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`gender\` enum ('male', 'female', 'other') NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`properties\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`user_kycs\` ADD CONSTRAINT \`FK_e237665f5ad576312d4b13b5e0a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`batteries\` ADD CONSTRAINT \`FK_f575b49083c8ddf1c92f79fc308\` FOREIGN KEY (\`qrCodeId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`batteries\` ADD CONSTRAINT \`FK_890f35c05dd24b936a8bdea2b8f\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_203683541105ef9807708f0622d\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stations\` ADD CONSTRAINT \`FK_d077f78e3da856a69763bb467c0\` FOREIGN KEY (\`addressId\`) REFERENCES \`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stations\` ADD CONSTRAINT \`FK_aefda3151eae91995e6a98ad0d5\` FOREIGN KEY (\`managerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_221420cb636d4e9e48aeca528a0\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_95c93a584de49f0b0e13f753630\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_95c93a584de49f0b0e13f753630\``);
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_221420cb636d4e9e48aeca528a0\``);
        await queryRunner.query(`ALTER TABLE \`stations\` DROP FOREIGN KEY \`FK_aefda3151eae91995e6a98ad0d5\``);
        await queryRunner.query(`ALTER TABLE \`stations\` DROP FOREIGN KEY \`FK_d077f78e3da856a69763bb467c0\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_203683541105ef9807708f0622d\``);
        await queryRunner.query(`ALTER TABLE \`batteries\` DROP FOREIGN KEY \`FK_890f35c05dd24b936a8bdea2b8f\``);
        await queryRunner.query(`ALTER TABLE \`batteries\` DROP FOREIGN KEY \`FK_f575b49083c8ddf1c92f79fc308\``);
        await queryRunner.query(`ALTER TABLE \`user_kycs\` DROP FOREIGN KEY \`FK_e237665f5ad576312d4b13b5e0a\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`properties\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
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
    }
}
