import { Gender } from '@yugo/shared'
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { AddressEntity } from './address.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { RoleEntity } from './role.entity.js'
import { UserKycEntity } from './user-kyc.entity.js'
import { StationEntity } from './station.entity.js'

@Entity({ name: 'users' })
@Index(['email', 'mobilenumber'])
export class UserEntity extends IdTimestamppedEntity {
    // Properties
    @Column('varchar', { nullable: true, unique: true })
    email: string

    @Column('varchar', { nullable: true, unique: true })
    mobilenumber: string

    @Column('boolean', { default: true })
    active: boolean

    @Column('varchar', { nullable: true })
    password: string

    @Column('varchar', { nullable: true })
    firstName: string

    @Column('varchar', { nullable: true })
    lastName: string

    @Column('varchar', { nullable: true })
    avatar: string

    @Column('date', { nullable: true })
    dateOfBirth: Date

    @Column('enum', { enum: Gender, nullable: true })
    gender: Gender

    @Column('json', { nullable: true })
    properties: any

    // Relations
    @ManyToMany(() => RoleEntity, (r) => r.name, { cascade: true })
    @JoinTable()
    roles: RoleEntity[]

    @OneToMany(() => AddressEntity, (a) => a.user, { cascade: true })
    addresses: AddressEntity[]

    @OneToMany(() => UserKycEntity, (k) => k.user, { cascade: true })
    kycs: UserKycEntity[]

    @ManyToOne(() => StationEntity, (s) => s.managers, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    station: StationEntity

    @Column({ nullable: true })
    stationId: string

    // CONSTANTS
    static PASSWORD_SALT_ROUNDS: number = 10
}
