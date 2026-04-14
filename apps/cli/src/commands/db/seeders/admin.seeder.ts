import { Logger } from '@nestjs/common';
import { RoleEntity, UserEntity } from '@yugo/nestjs-database/entities';
import { Roles } from '@yugo/shared';
import { hashSync } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class AdminSeeder implements Seeder {
    private readonly logger = new Logger(AdminSeeder.name);

    public async run(datasource: DataSource): Promise<void> {
        const manager = datasource.manager;
        const email = process.env.ADMIN_EMAIL || 'yugo@admin.com';
        const password = process.env.ADMIN_PASSWORD || 'abcd@1234';
        const adminRole = await manager.findOneBy(RoleEntity, {
            name: Roles.SYSTEM_ADMIN,
        });
        if (!adminRole) {
            this.logger.error(
                'SYSTEM_ADMIN role not found. Please run RolesSeeder first.',
            );
            return;
        }
        const existing = await manager.findOneBy(UserEntity, { email });
        if (existing) {
            this.logger.log(`Admin user with email ${email} already exists.`);
            return;
        }
        const admin = manager.create(UserEntity, {
            email,
            password: hashSync(password, 10),
            roles: [adminRole],
            firstName: 'System',
            lastName: 'Admin',
        });
        await manager.save(admin);
    }
}
