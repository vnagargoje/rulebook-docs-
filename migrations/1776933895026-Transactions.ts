import type { MigrationInterface, QueryRunner } from "typeorm";

export class transactions1776933895026 implements MigrationInterface {
    name = 'transactions1776933895026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transactions\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`razorpayOrderId\` varchar(255) NOT NULL, \`razorpayPaymentId\` varchar(255) NULL, \`razorpaySignature\` varchar(255) NULL, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'INR', \`status\` enum ('awaiting', 'succeeded', 'failed', 'cancelled') NOT NULL DEFAULT 'awaiting', \`notes\` text NULL, \`userPlanId\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_404407f96366583a8f6cdec52c\` (\`razorpayOrderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_7dc06153bbeab2f39399481b46e\` FOREIGN KEY (\`userPlanId\`) REFERENCES \`user_plans\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_7dc06153bbeab2f39399481b46e\``);
        await queryRunner.query(`DROP INDEX \`IDX_404407f96366583a8f6cdec52c\` ON \`transactions\``);
        await queryRunner.query(`DROP TABLE \`transactions\``);
    }
}
