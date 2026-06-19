import type { MigrationInterface, QueryRunner } from "typeorm";

export class notificationService1781794294390 implements MigrationInterface {
    name = 'notificationService1781794294390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification_delivery\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`eventId\` varchar(255) NOT NULL, \`status\` enum ('sent', 'failed') NOT NULL, \`title\` varchar(255) NULL, \`body\` text NOT NULL, \`message\` text NOT NULL, \`notificationId\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`eventKey\` varchar(255) NOT NULL, \`channel\` enum ('push') NOT NULL, \`title\` varchar(255) NULL, \`body\` text NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, INDEX \`IDX_aae963baa3658228606bc6b94d\` (\`eventKey\`), UNIQUE INDEX \`IDX_50802da9f1d09f275d964dd491\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notification_delivery\` ADD CONSTRAINT \`FK_44ae81122e4c1e71660c04405e4\` FOREIGN KEY (\`notificationId\`) REFERENCES \`notification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification_delivery\` DROP FOREIGN KEY \`FK_44ae81122e4c1e71660c04405e4\``);
        await queryRunner.query(`DROP INDEX \`IDX_50802da9f1d09f275d964dd491\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_aae963baa3658228606bc6b94d\` ON \`notification\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`notification_delivery\``);
    }
}
