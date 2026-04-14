import { type VehicleProperties } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { StationEntity } from './station.entity.js'

@Entity({ name: 'vehicles' })
export class VehicleEntity extends IdTimestamppedEntity {
    @Column('varchar', { nullable: true, unique: true })
    vehicleNumber: string

    @Column('varchar', { nullable: true })
    rcNumber: string

    @Column('varchar', { nullable: true })
    chassisNumber: string

    @Column('varchar', { nullable: true })
    gpsId: string

    @Column('json', { nullable: true })
    properties: VehicleProperties

    // Relations
    @Column('varchar', { nullable: true })
    stationId: string

    @ManyToOne(() => StationEntity, (s) => s.vehicles, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    station: StationEntity
}
