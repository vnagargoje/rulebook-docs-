import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { RoleEntity } from './role.entity.js'

@Entity({ name: 'users' })
@Index(['email', 'mobilenumber'])
export class UserEntity extends IdTimestamppedEntity {
    @Column('varchar', { nullable: true, unique: true })
    email: string

    @Column('varchar', { nullable: true, unique: true })
    mobilenumber: string

    @Column('varchar', { nullable: true })
    password: string

    @Column('varchar', { nullable: true })
    firstName: string

    @Column('varchar', { nullable: true })
    lastName: string

    @Column('varchar', { nullable: true })
    avatar: string

    // Relations
    @ManyToMany(() => RoleEntity, (role) => role.name, { cascade: true })
    @JoinTable()
    roles: RoleEntity[]

    // CONSTANTS
    static PASSWORD_SALT_ROUNDS: number = 10
}
