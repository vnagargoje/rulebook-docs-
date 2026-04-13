import { RoleEntity } from '@yugo/nestjs-database/entities';
import { Roles } from '@yugo/shared';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class RolesSeeder implements Seeder {
    public async run(datasource: DataSource): Promise<void> {
        const manager = datasource.manager;
        const roles = Object.values(Roles);
        for (const roleName of roles) {
            const exists = await manager.findOneBy(RoleEntity, {
                name: roleName,
            });
            if (!exists) {
                await manager.save(
                    manager.create(RoleEntity, {
                        name: roleName,
                    }),
                );
            }
        }
    }
}
