import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BatteryEntity, BookingEntity, VehicleEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus } from '@yugo/shared'
import { EntityManager } from 'typeorm'
import { AssignVehicleToBookingCommand } from '../../impl/bookings/assign-vehicle-to-booking.command.js'

@CommandHandler(AssignVehicleToBookingCommand)
export class AssignVehicleToBookingHandler implements ICommandHandler<AssignVehicleToBookingCommand> {
    private readonly logger = new Logger(AssignVehicleToBookingHandler.name)

    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: AssignVehicleToBookingCommand) {
        const { bookingId, vehicleId, batteryId } = command

        return this.manager.transaction(async (manager) => {
            const booking = await manager.findOne(BookingEntity, {
                where: { id: bookingId },
            })
            if (!booking) {
                throw new NotFoundException('Booking not found')
            }
            if (booking.status !== BookingStatus.CREATED) {
                throw new BadRequestException('Booking is not in a valid state for vehicle assignment')
            }

            const vehicle = await manager.findOne(VehicleEntity, {
                where: { id: vehicleId },
            })
            if (!vehicle) {
                throw new NotFoundException('Vehicle not found')
            }

            const existingVehicleBooking = await manager.findOne(BookingEntity, {
                where: { vehicleId, status: BookingStatus.IN_PROGRESS },
            })
            if (existingVehicleBooking) {
                throw new BadRequestException('Vehicle is already assigned to an active booking')
            }

            const battery = await manager.findOne(BatteryEntity, {
                where: { id: batteryId },
            })
            if (!battery) {
                throw new NotFoundException('Battery not found')
            }

            booking.vehicleId = vehicleId
            booking.batteryId = batteryId
            booking.status = BookingStatus.VEHICLE_ASSIGNED
            await manager.save(booking)

            this.logger.log(`Vehicle ${vehicleId} assigned to booking ${bookingId}`)

            return booking
        })
    }
}
