import { RoleEntity } from '@yugo/nestjs-database/entities';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class RolesSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(RoleEntity);
        const roles = ['admin', 'user', 'guest'];

        for (const roleName of roles) {
            const exists = await repository.findOneBy({ name: roleName });
            if (!exists) {
                await repository.save(
                    repository.create({
                        name: roleName,
                    }),
                );
            }
        }
    }
}
