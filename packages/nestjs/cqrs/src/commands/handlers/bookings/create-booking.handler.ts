import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BookingEntity, StationEntity, UserPlanEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus, StationType, UserPlanStatus } from '@yugo/shared'
import { DataSource } from 'typeorm'
import { CreateBookingCommand } from '../../impl/bookings/create-booking.command.js'

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
    private readonly logger = new Logger(CreateBookingHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreateBookingCommand) {
        const { userId, userPlanId, stationId } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const userPlan = await manager.findOne(UserPlanEntity, {
                where: { id: userPlanId, userId },
            })
            if (!userPlan) {
                throw new NotFoundException('User plan not found')
            }
            if (userPlan.status !== UserPlanStatus.ACTIVE) {
                throw new BadRequestException('User plan is not active')
            }

            const existingBooking = await manager.findOne(BookingEntity, {
                where: { userPlanId },
            })
            if (existingBooking) {
                throw new BadRequestException('A booking already exists for this plan')
            }

            const station = await manager.findOne(StationEntity, {
                where: { id: stationId },
            })
            if (!station) {
                throw new NotFoundException('Station not found')
            }
            if (station.type !== StationType.SWAP_STATION) {
                throw new BadRequestException('Bookings can only be made at swap stations')
            }
            if (!station.active) {
                throw new BadRequestException('This station is not active')
            }

            const pickupOtp = String(Math.floor(1000 + Math.random() * 9000))

            const booking = manager.create(BookingEntity, {
                userPlanId,
                stationId,
                status: BookingStatus.CREATED,
                pickupOtp,
            })
            await manager.save(booking)

            this.logger.log(`Booking created: ${booking.id} for user ${userId}`)

            return booking
        })
    }
}
