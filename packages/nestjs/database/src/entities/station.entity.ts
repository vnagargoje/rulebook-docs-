import { StationType } from '@yugo/shared'
import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, TableInheritance } from 'typeorm'
import { AddressEntity } from './address.entity.js'
import { BatteryEntity } from './battery.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { VehicleEntity } from './vehicle.entity.js'

@Entity({ name: 'stations' })
@TableInheritance({ column: { name: 'type' } })
export abstract class StationEntity extends IdTimestamppedEntity {
    @Column('enum', { nullable: false, enum: StationType })
    type: StationType

    @Column('varchar')
    name: string

    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    latitude: number

    @Column('decimal', { precision: 11, scale: 8, nullable: true })
    longitude: number

    @Column('boolean', { default: true })
    active: boolean

    // Relations
    @Column('varchar', { nullable: true })
    addressId: string

    @OneToOne(() => AddressEntity, { nullable: true, cascade: true })
    @JoinColumn()
    address: AddressEntity

    @Column('varchar', { nullable: true })
    managerId: string

    @ManyToOne(() => UserEntity, (u) => u.stations, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    manager: UserEntity

    @OneToMany(() => VehicleEntity, (v) => v.station, { cascade: true })
    vehicles: VehicleEntity[]

    @OneToMany(() => BatteryEntity, (b) => b.station, { cascade: true })
    batteries: BatteryEntity[]
}

@ChildEntity(StationType.SWAP_STATION)
export class SwapStationEntity extends StationEntity {
    // Specific fields for Swaps can be added here
}

@ChildEntity(StationType.HUB_STATION)
export class HubStationEntity extends StationEntity {
    // Specific fields for Hubs can be added here
}
