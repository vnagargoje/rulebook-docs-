import type { MigrationInterface, QueryRunner } from "typeorm";

export class maintainanceEntity1781180463174 implements MigrationInterface {
    name = 'maintainanceEntity1781180463174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vehicle_maintenances\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`vehicleId\` varchar(255) NOT NULL, \`issueDescription\` text NOT NULL, \`status\` enum ('open', 'completed') NOT NULL DEFAULT 'open', \`expectedFixDate\` date NULL, \`remarks\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vehicle_maintenances\` ADD CONSTRAINT \`FK_8bc8a2c47f79d9827d9b2371a5e\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vehicle_maintenances\` DROP FOREIGN KEY \`FK_8bc8a2c47f79d9827d9b2371a5e\``);
        await queryRunner.query(`DROP TABLE \`vehicle_maintenances\``);
    }
}
