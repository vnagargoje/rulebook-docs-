import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BatteryEntity, BookingEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus } from '@yugo/shared'
import { DataSource } from 'typeorm'
import { VerifyInwardBatteryCommand } from '../../impl/battery-swaps/verify-inward-battery.command.js'

@CommandHandler(VerifyInwardBatteryCommand)
export class VerifyInwardBatteryHandler implements ICommandHandler<VerifyInwardBatteryCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: VerifyInwardBatteryCommand) {
        const { bookingId, batteryQrId } = command
        const manager = this.datasource.manager

        const booking = await manager.findOne(BookingEntity, {
            where: { id: bookingId },
        })
        if (!booking) {
            throw new NotFoundException('Booking not found')
        }
        if (booking.status !== BookingStatus.ONGOING) {
            throw new BadRequestException('Booking is not in ongoing state')
        }

        const battery = await manager.findOne(BatteryEntity, {
            where: { batteryQrId },
        })
        if (!battery) {
            throw new NotFoundException('Battery not found')
        }

        if (booking.batteryId !== battery.id) {
            throw new BadRequestException('Battery not assigned to this booking')
        }

        return {
            verified: true,
            bookingId: booking.id,
            batteryId: battery.id,
            batteryQrId: battery.batteryQrId,
        }
    }
}
