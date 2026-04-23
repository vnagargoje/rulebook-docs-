import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BookingEntity } from './booking.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { VehicleEntity } from './vehicle.entity.js'

@Entity({ name: 'vehicle_surrenders' })
export class VehicleSurrenderEntity extends IdTimestamppedEntity {
    // properties
    @Column('int', { default: 0 })
    penalty: number

    @Column('int', { default: 0 })
    miscCharges: number

    @Column('int', { default: 0 })
    refundAmount: number

    @Column('varchar', { nullable: true })
    notes: string

    // relations
    @Column('varchar')
    vehicleId: string

    @ManyToOne(() => VehicleEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    vehicle: VehicleEntity

    @Column('varchar', { unique: true })
    bookingId: string

    @OneToOne(() => BookingEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    booking: BookingEntity
}
