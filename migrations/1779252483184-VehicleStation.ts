import type { MigrationInterface, QueryRunner } from "typeorm";

export class vehicleStation1779252483184 implements MigrationInterface {
    name = 'vehicleStation1779252483184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stations\` CHANGE \`type\` \`type\` enum ('swap_station', 'hub_station', 'vehicle_station') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stations\` CHANGE \`type\` \`type\` enum ('swap_station', 'hub_station') NOT NULL`);
    }
}
