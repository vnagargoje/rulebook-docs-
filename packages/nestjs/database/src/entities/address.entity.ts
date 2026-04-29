import { AddressType } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CityEntity } from './city.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'

@Entity({ name: 'addresses' })
export class AddressEntity extends IdTimestamppedEntity {
    // Properties
    @Column('varchar', { nullable: false })
    lineOne: string

    @Column('varchar', { nullable: true })
    lineTwo: string

    @Column('varchar', { nullable: false })
    pincode: string

    @Column('enum', { enum: AddressType, nullable: true })
    type: AddressType

    // Relations
    @Column('varchar', { nullable: true })
    cityId: string

    @ManyToOne(() => CityEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    city: CityEntity

    @Column('varchar', { nullable: true })
    userId: string

    @ManyToOne(() => UserEntity, (u) => u.addresses, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: UserEntity
}
