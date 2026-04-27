import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import {
    BatteryEntity,
    BatterySwapHistoryEntity,
    BookingEntity,
    FileEntity,
    UserPlanEntity,
} from '@yugo/nestjs-database/entities'
import { BatteryStatus, BookingStatus, UserPlanStatus } from '@yugo/shared'
import { isAfter } from 'date-fns'
import { toBuffer } from 'qrcode'
import { DataSource, EntityManager } from 'typeorm'
import { ExecuteBatterySwapCommand } from '../../impl/battery-swaps/execute-battery-swap.command.js'

const ACTIVE_BOOKING_STATUSES = [BookingStatus.ONGOING]

@CommandHandler(ExecuteBatterySwapCommand)
export class ExecuteBatterySwapHandler implements ICommandHandler<ExecuteBatterySwapCommand> {
    private readonly s3Client: S3Client

    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {
        const s3Config = this.configService.getOrThrow('s3-client.config')
        this.s3Client = new S3Client(s3Config)
    }

    async execute(command: ExecuteBatterySwapCommand) {
        const { bookingId, newBatteryQrId, stationId, swappedById } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const booking = await manager.findOne(BookingEntity, {
                where: { id: bookingId },
            })
            if (!booking) {
                throw new NotFoundException('Booking not found')
            }
            if (booking.status !== BookingStatus.ONGOING) {
                throw new BadRequestException('Booking is not in ongoing state')
            }

            const oldBattery = await manager.findOne(BatteryEntity, {
                where: { id: booking.batteryId! },
            })
            if (!oldBattery) {
                throw new NotFoundException('Current battery not found in system')
            }

            const newBattery = await manager.findOne(BatteryEntity, {
                where: { batteryQrId: newBatteryQrId },
            })
            if (!newBattery) {
                throw new NotFoundException('New battery not found')
            }

            const existingBatteryBooking = await manager
                .createQueryBuilder(BookingEntity, 'b')
                .where('b.batteryId = :batteryId', { batteryId: newBattery.id })
                .andWhere('b.status IN (:...statuses)', { statuses: ACTIVE_BOOKING_STATUSES })
                .getOne()
            if (existingBatteryBooking) {
                throw new BadRequestException('Battery not available for assignment — already in active booking')
            }

            if (oldBattery.id === newBattery.id) {
                throw new BadRequestException('New battery cannot be the same as the old battery')
            }

            const plan = await manager.findOne(UserPlanEntity, {
                where: { id: booking.userPlanId },
            })
            if (!plan || isAfter(new Date(), plan.expiresAt) || plan.status !== UserPlanStatus.ACTIVE) {
                throw new NotFoundException('User dont have a valid plan for battery swapping')
            }

            const fromStationId = newBattery.stationId

            booking.batteryId = newBattery.id
            await manager.save(booking)

            oldBattery.stationId = stationId
            oldBattery.status = BatteryStatus.DRAINED
            await manager.save(oldBattery)

            newBattery.stationId = null as any
            newBattery.status = BatteryStatus.IN_USE
            await manager.save(newBattery)

            const kmLimit = plan.planSnapshot?.kmLimit || 0
            if (kmLimit > 0) {
                const rangeStr = oldBattery.properties?.range || '0'
                const range = parseFloat(rangeStr) || 0
                plan.remainingKm = Number(plan.remainingKm) - range
            }
            await manager.save(plan)

            const swapHistory = manager.create(BatterySwapHistoryEntity, {
                userPlanId: booking.userPlanId,
                bookingId: booking.id,
                vehicleId: booking.vehicleId!,
                oldBatteryId: oldBattery.id,
                newBatteryId: newBattery.id,
                fromStationId: fromStationId,
                toStationId: stationId,
                swappedById: swappedById,
            })
            await manager.save(swapHistory)

            await this.regeneratePlanQrCode(manager, booking.userPlanId, booking.vehicleId!, newBattery.id)

            return {
                swapHistoryId: swapHistory.id,
                bookingId: booking.id,
                vehicleId: booking.vehicleId,
                oldBatteryId: oldBattery.id,
                oldBatteryQrId: oldBattery.batteryQrId,
                newBatteryId: newBattery.id,
                newBatteryQrId: newBattery.batteryQrId,
                fromStationId: fromStationId,
                toStationId: stationId,
                swappedById: swappedById,
                swappedAt: swapHistory.createdAt,
            }
        })
    }

    private async regeneratePlanQrCode(
        manager: EntityManager,
        userPlanId: string,
        vehicleId: string,
        newBatteryId: string,
    ): Promise<void> {
        const userPlan = await manager.findOne(UserPlanEntity, {
            where: { id: userPlanId },
        })
        if (!userPlan) return

        const qrPayload = JSON.stringify({
            userPlanId: userPlan.id,
            vehicleId,
            batteryId: newBatteryId,
        })
        const qrBuffer = await toBuffer(qrPayload, { type: 'png', width: 400 })

        const s3ClientConfig = this.configService.getOrThrow<any>('s3-client.config')
        const endpoint = s3ClientConfig.endpoint as string
        const bucket = this.configService.getOrThrow<{ bucket: string }>('s3-bucket').bucket
        const s3Key = `qr-codes/plans/${userPlan.id}.png`

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: s3Key,
                Body: qrBuffer,
                ContentType: 'image/png',
            }),
        )

        if (userPlan.qrCodeId) {
            await manager.update(FileEntity, userPlan.qrCodeId, {
                size: qrBuffer.length,
            })
        } else {
            const file = manager.create(FileEntity, {
                filename: `${userPlan.id}.png`,
                path: `${endpoint.replace(/\/$/, '')}/${bucket}/${s3Key}`,
                mimeType: 'image/png',
                size: qrBuffer.length,
            })
            await manager.save(file)
            userPlan.qrCodeId = file.id
            await manager.save(userPlan)
        }
    }
}
