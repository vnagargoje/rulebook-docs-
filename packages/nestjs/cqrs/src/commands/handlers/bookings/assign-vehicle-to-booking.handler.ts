import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BatteryEntity, BookingEntity, FileEntity, UserPlanEntity, VehicleEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus, BatteryStatus, UserPlanStatus, VehicleStatus } from '@yugo/shared'
import { addDays } from 'date-fns'
import { toBuffer } from 'qrcode'
import { DataSource, EntityManager } from 'typeorm'
import { AssignVehicleToBookingCommand } from '../../impl/bookings/assign-vehicle-to-booking.command.js'

const ACTIVE_BOOKING_STATUSES = [BookingStatus.ONGOING]

@CommandHandler(AssignVehicleToBookingCommand)
export class AssignVehicleToBookingHandler implements ICommandHandler<AssignVehicleToBookingCommand> {
    private readonly logger = new Logger(AssignVehicleToBookingHandler.name)
    private readonly s3Client: S3Client

    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {
        const s3Config = this.configService.getOrThrow('s3-client.config')
        this.s3Client = new S3Client(s3Config)
    }

    async execute(command: AssignVehicleToBookingCommand) {
        const { bookingId, vehicleId, batteryId, otp } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const booking = await manager.findOne(BookingEntity, {
                where: { id: bookingId },
            })
            if (!booking) {
                throw new NotFoundException('Booking not found')
            }
            if (booking.status !== BookingStatus.CREATED) {
                throw new BadRequestException('Booking is not in a valid state for vehicle assignment')
            }

            if (booking.pickupOtp !== otp) {
                throw new BadRequestException('Invalid pickup OTP')
            }

            const vehicle = await manager.findOne(VehicleEntity, {
                where: { id: vehicleId },
            })
            if (!vehicle) {
                throw new NotFoundException('Vehicle not found')
            }

            const existingVehicleBooking = await manager
                .createQueryBuilder(BookingEntity, 'b')
                .where('b.vehicleId = :vehicleId', { vehicleId })
                .andWhere('b.status IN (:...statuses)', { statuses: ACTIVE_BOOKING_STATUSES })
                .getOne()
            if (existingVehicleBooking) {
                throw new BadRequestException('Vehicle is already assigned to an active booking')
            }

            const battery = await manager.findOne(BatteryEntity, {
                where: { id: batteryId },
            })
            if (!battery) {
                throw new NotFoundException('Battery not found')
            }

            const existingBatteryBooking = await manager
                .createQueryBuilder(BookingEntity, 'b')
                .where('b.batteryId = :batteryId', { batteryId })
                .andWhere('b.status IN (:...statuses)', { statuses: ACTIVE_BOOKING_STATUSES })
                .getOne()
            if (existingBatteryBooking) {
                throw new BadRequestException('Battery is already assigned to an active booking')
            }

            const userPlan = await manager.findOne(UserPlanEntity, {
                where: { id: booking.userPlanId, status: UserPlanStatus.PURCHASED },
            })
            if (!userPlan) {
                throw new NotFoundException('User plan not found for this booking')
            }

            booking.vehicleId = vehicleId
            booking.batteryId = batteryId
            booking.stationId = vehicle.stationId ?? null
            booking.status = BookingStatus.ONGOING
            await manager.save(booking)

            vehicle.status = VehicleStatus.IN_USE
            await manager.save(vehicle)

            battery.status = BatteryStatus.IN_USE
            battery.stationId = null as any
            await manager.save(battery)

            userPlan.status = UserPlanStatus.ACTIVE
            userPlan.startsAt = new Date()
            userPlan.expiresAt = addDays(userPlan.startsAt, Number(userPlan.planSnapshot.validityDays))
            await manager.save(userPlan)

            await this.generateAndUploadQrCode(manager, userPlan, vehicleId, batteryId)
            return booking
        })
    }

    private async generateAndUploadQrCode(
        manager: EntityManager,
        userPlan: UserPlanEntity,
        vehicleId: string,
        batteryId: string,
    ): Promise<void> {
        const qrPayload = JSON.stringify({
            userPlanId: userPlan.id,
            vehicleId,
            batteryId,
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
                ACL: 'public-read',
            }),
        )

        const file = manager.create(FileEntity, {
            filename: `${userPlan.id}.png`,
            path: `${endpoint.replace(/\/$/, '')}/${bucket}/${s3Key}`,
            mimeType: 'image/png',
            size: qrBuffer.length,
        })
        await manager.save(file)

        userPlan.qrCodeId = file.id
        await manager.save(userPlan)

        this.logger.log(`QR code uploaded to S3: ${s3Key}`)
    }
}
