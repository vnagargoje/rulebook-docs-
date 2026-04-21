import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BatteryEntity } from './battery.entity.js'
import { BookingEntity } from './booking.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { StationEntity } from './station.entity.js'
import { UserEntity } from './user.entity.js'
import { UserPlanEntity } from './user-plan.entity.js'
import { VehicleEntity } from './vehicle.entity.js'

@Entity({ name: 'battery_swap_histories' })
export class BatterySwapHistoryEntity extends IdTimestamppedEntity {
    @Column('varchar')
    userPlanId: string

    @ManyToOne(() => UserPlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    userPlan: UserPlanEntity

    @Column('varchar')
    bookingId: string

    @ManyToOne(() => BookingEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    booking: BookingEntity

    @Column('varchar', { nullable: true })
    vehicleId: string | null

    @ManyToOne(() => VehicleEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    vehicle: VehicleEntity

    @Column('varchar', { nullable: true })
    oldBatteryId: string | null

    @ManyToOne(() => BatteryEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    oldBattery: BatteryEntity

    @Column('varchar', { nullable: true })
    newBatteryId: string | null

    @ManyToOne(() => BatteryEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    newBattery: BatteryEntity

    @Column('varchar', { nullable: true })
    fromStationId: string | null

    @ManyToOne(() => StationEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    fromStation: StationEntity

    @Column('varchar', { nullable: true })
    toStationId: string | null

    @ManyToOne(() => StationEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    toStation: StationEntity

    @Column('varchar', { nullable: true })
    swappedById: string | null

    @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    swappedBy: UserEntity
}
