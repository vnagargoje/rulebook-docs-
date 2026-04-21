import { BatteryTransportStatus } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { StationEntity } from './station.entity.js'
import { UserEntity } from './user.entity.js'
import { VehicleEntity } from './vehicle.entity.js'

@Entity({ name: 'battery_transports' })
export class BatteryTransportEntity extends IdTimestamppedEntity {
    @Column('varchar')
    fromStationId: string

    @ManyToOne(() => StationEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    fromStation: StationEntity

    @Column('varchar')
    toStationId: string

    @ManyToOne(() => StationEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    toStation: StationEntity

    @Column('varchar')
    vehicleId: string

    @ManyToOne(() => VehicleEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    vehicle: VehicleEntity

    @Column('varchar', { nullable: true })
    initiatedById: string | null

    @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    initiatedBy: UserEntity

    @Column('varchar', { nullable: true })
    receivedById: string | null

    @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    receivedBy: UserEntity

    @Column('json')
    batteryIds: string[]

    @Column('enum', { enum: BatteryTransportStatus, default: BatteryTransportStatus.IN_TRANSIT })
    status: BatteryTransportStatus

    @Column('timestamp', { nullable: true })
    receivedAt: Date | null
}
