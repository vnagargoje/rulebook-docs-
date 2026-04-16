import { BookingStatus } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BatteryEntity } from './battery.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { StationEntity } from './station.entity.js'
import { UserPlanEntity } from './user-plan.entity.js'
import { VehicleEntity } from './vehicle.entity.js'

@Entity({ name: 'bookings' })
export class BookingEntity extends IdTimestamppedEntity {
    @Column('varchar', { unique: true })
    userPlanId: string

    @OneToOne(() => UserPlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    userPlan: UserPlanEntity

    @Column('varchar')
    stationId: string

    @ManyToOne(() => StationEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    station: StationEntity

    @Column('varchar', { nullable: true })
    vehicleId: string

    @ManyToOne(() => VehicleEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    vehicle: VehicleEntity

    @Column('varchar', { nullable: true })
    batteryId: string

    @ManyToOne(() => BatteryEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    battery: BatteryEntity

    @Column('enum', { enum: BookingStatus, default: BookingStatus.CREATED })
    status: BookingStatus

    @Column('varchar', { length: 4 })
    pickupOtp: string
}
