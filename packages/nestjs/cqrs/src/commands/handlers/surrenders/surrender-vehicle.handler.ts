import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import {
    BatteryEntity,
    BookingEntity,
    UserPlanEntity,
    VehicleEntity,
    VehicleSurrenderEntity,
} from '@yugo/nestjs-database/entities'
import { BatteryStatus, BookingStatus, UserPlanStatus, VehicleStatus } from '@yugo/shared'
import { SurrenderVehicleCommand } from 'src/commands/impl/surrenders'
import { DataSource } from 'typeorm'

@CommandHandler(SurrenderVehicleCommand)
export class SurrenderVehicleHandler implements ICommandHandler<SurrenderVehicleCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: SurrenderVehicleCommand) {
        const { vehicleNumber, penalty, miscCharges, refundAmount, notes } = command
        const manager = this.datasource.manager
        const vehicle = await manager.findOne(VehicleEntity, {
            where: { vehicleNumber },
        })

        if (!vehicle) {
            throw new NotFoundException(`Vehicle not found: ${vehicleNumber}`)
        }

        const booking = await manager
            .createQueryBuilder(BookingEntity, 'booking')
            .innerJoinAndSelect('booking.userPlan', 'userPlan')
            .where('booking.vehicleId = :vehicleId', { vehicleId: vehicle.id })
            .andWhere('booking.status = :status', { status: BookingStatus.ONGOING })
            .getOne()

        if (!booking) {
            throw new NotFoundException(`No active booking found for vehicle: ${vehicleNumber}`)
        }

        const existing = await manager.findOne(VehicleSurrenderEntity, {
            where: { bookingId: booking.id },
        })

        if (existing) {
            throw new BadRequestException(`Vehicle has already been surrendered for this booking`)
        }

        return manager.transaction(async (tx) => {
            const surrender = tx.create(VehicleSurrenderEntity, {
                vehicleId: vehicle.id,
                bookingId: booking.id,
                penalty,
                miscCharges,
                refundAmount,
                notes: notes || undefined,
            })
            await tx.save(surrender)
            await tx.update(BookingEntity, booking.id, {
                status: BookingStatus.COMPLETED,
            })
            await tx.update(UserPlanEntity, booking.userPlanId, {
                status: UserPlanStatus.EXPIRED,
            })
            await tx.update(BatteryEntity, { id: booking.batteryId }, { status: BatteryStatus.AVAILABLE })
            await tx.update(VehicleEntity, { id: vehicle.id }, { status: VehicleStatus.AVAILABLE })
            return {
                id: surrender.id,
                bookingId: booking.id,
                userPlanId: booking.userPlanId,
                vehicleId: vehicle.id,
                vehicle,
                penalty,
                miscCharges,
                refundAmount,
                notes: surrender.notes,
            }
        })
    }
}
