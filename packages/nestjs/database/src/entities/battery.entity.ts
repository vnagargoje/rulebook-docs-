import { type BatteryProperties } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { FileEntity } from './file.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { StationEntity } from './station.entity.js'

@Entity({ name: 'batteries' })
export class BatteryEntity extends IdTimestamppedEntity {
    @Column('varchar', { unique: true })
    batteryQrId: string

    @Column('varchar', { nullable: true })
    gpsId: string

    @Column('json', { nullable: true })
    properties: BatteryProperties

    // Relations
    @Column('varchar', { nullable: true })
    qrCodeId: string

    @OneToOne(() => FileEntity, { nullable: true, cascade: true })
    @JoinColumn()
    qrCode: FileEntity

    @Column('varchar', { nullable: true })
    stationId: string

    @ManyToOne(() => StationEntity, (station) => station.batteries, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    station: StationEntity
}
