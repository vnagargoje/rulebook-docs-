import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { VehicleEntity } from './vehicle.entity.js'
import { VehicleMaintenanceStatus } from '@yugo/shared'

@Entity({ name: 'vehicle_maintenances' })
export class VehicleMaintenanceEntity extends IdTimestamppedEntity {
    @Column('varchar')
    vehicleId: string

    @ManyToOne(() => VehicleEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vehicleId' })
    vehicle: VehicleEntity

    @Column('text')
    issueDescription: string

    @Column('enum', {
        enum: VehicleMaintenanceStatus,
        default: VehicleMaintenanceStatus.OPEN,
    })
    status: VehicleMaintenanceStatus

    @Column('date', { nullable: true })
    expectedFixDate: Date | null

    @Column('text', { nullable: true })
    remarks: string | null
}
