import type { MigrationInterface, QueryRunner } from "typeorm";

export class initial1775810888408 implements MigrationInterface {
    name = 'initial1775810888408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`name\` varchar(255) NOT NULL, PRIMARY KEY (\`name\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(26) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`email\` varchar(255) NULL, \`mobilenumber\` varchar(255) NULL, \`password\` varchar(255) NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`avatar\` varchar(255) NULL, INDEX \`IDX_c65791a450647d236039188a07\` (\`email\`, \`mobilenumber\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_41823e592cca849bbb4c7e72a7\` (\`mobilenumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cities\` (\`id\` varchar(26) NOT NULL, \`name\` varchar(255) NOT NULL, \`latitude\` decimal(10,8) NULL, \`longitude\` decimal(11,8) NULL, \`stateId\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`states\` (\`id\` varchar(26) NOT NULL, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`latitude\` decimal(10,8) NULL, \`longitude\` decimal(11,8) NULL, \`countryCode\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`countries\` (\`code\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_roles_roles\` (\`usersId\` varchar(26) NOT NULL, \`rolesName\` varchar(255) NOT NULL, INDEX \`IDX_df951a64f09865171d2d7a502b\` (\`usersId\`), INDEX \`IDX_9fc16941d812c4d99e9eb6c279\` (\`rolesName\`), PRIMARY KEY (\`usersId\`, \`rolesName\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cities\` ADD CONSTRAINT \`FK_ded8a17cd090922d5bac8a2361f\` FOREIGN KEY (\`stateId\`) REFERENCES \`states\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`states\` ADD CONSTRAINT \`FK_8077396702f265b2185404feb01\` FOREIGN KEY (\`countryCode\`) REFERENCES \`countries\`(\`code\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_df951a64f09865171d2d7a502b1\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_9fc16941d812c4d99e9eb6c2798\` FOREIGN KEY (\`rolesName\`) REFERENCES \`roles\`(\`name\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_9fc16941d812c4d99e9eb6c2798\``);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_df951a64f09865171d2d7a502b1\``);
        await queryRunner.query(`ALTER TABLE \`states\` DROP FOREIGN KEY \`FK_8077396702f265b2185404feb01\``);
        await queryRunner.query(`ALTER TABLE \`cities\` DROP FOREIGN KEY \`FK_ded8a17cd090922d5bac8a2361f\``);
        await queryRunner.query(`DROP INDEX \`IDX_9fc16941d812c4d99e9eb6c279\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_df951a64f09865171d2d7a502b\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`users_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`countries\``);
        await queryRunner.query(`DROP TABLE \`states\``);
        await queryRunner.query(`DROP TABLE \`cities\``);
        await queryRunner.query(`DROP INDEX \`IDX_41823e592cca849bbb4c7e72a7\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_c65791a450647d236039188a07\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }
}
