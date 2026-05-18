import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BookingEntity, FileEntity, UserPlanEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus, UserPlanStatus } from '@yugo/shared'
import { addDays } from 'date-fns'
import { DataSource, EntityManager } from 'typeorm'
import { ActivateQueuedPlanCommand } from '../../impl/user-plans/activate-queued-plan.command.js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { toBuffer } from 'qrcode'

@CommandHandler(ActivateQueuedPlanCommand)
export class ActivateQueuedPlanHandler implements ICommandHandler<ActivateQueuedPlanCommand> {
    private readonly logger = new Logger(ActivateQueuedPlanHandler.name)
    private readonly s3Client: S3Client

    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {
        const s3Config = this.configService.getOrThrow('s3-client.config')
        this.s3Client = new S3Client(s3Config)
    }

    async execute(command: ActivateQueuedPlanCommand) {
        const { userId, userPlanId } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const planToActivate = await manager.findOne(UserPlanEntity, {
                where: { id: userPlanId, userId, status: UserPlanStatus.PURCHASED },
            })

            if (!planToActivate) {
                throw new NotFoundException('Plan to activate not found or not in PURCHASED state')
            }

            const activePlan = await manager.findOne(UserPlanEntity, {
                where: { userId, status: UserPlanStatus.ACTIVE },
            })

            if (!activePlan) {
                throw new BadRequestException('No active plan found to replace')
            }

            const isExhausted = Number(activePlan.remainingKm) <= 0
            const isExpired = activePlan.expiresAt && activePlan.expiresAt < new Date()

            if (!isExhausted && !isExpired) {
                throw new BadRequestException(
                    'Current plan is neither exhausted nor expired. You cannot activate the new plan yet.',
                )
            }

            let carryForwardKm = 0
            if (isExpired && Number(activePlan.remainingKm) > 0) {
                carryForwardKm = Number(activePlan.remainingKm)
            }

            const activeBooking = await manager.findOne(BookingEntity, {
                where: { userPlanId: activePlan.id, status: BookingStatus.ONGOING },
            })

            if (!activeBooking) {
                throw new BadRequestException(
                    'No ongoing booking found for the active plan. Please visit a station to activate your new plan.',
                )
            }

            if (!activeBooking.vehicleId) {
                throw new InternalServerErrorException('vehicleId missing in previously active plan')
            }
            if (!activeBooking.batteryId) {
                throw new InternalServerErrorException('batteryId missing in previously active plan')
            }

            const newBooking = await manager.findOne(BookingEntity, {
                where: { userPlanId: planToActivate.id, status: BookingStatus.CREATED },
            })

            if (!newBooking) {
                throw new NotFoundException('Booking for the new plan not found')
            }

            activePlan.status = UserPlanStatus.EXPIRED
            await manager.save(activePlan)

            activeBooking.status = BookingStatus.COMPLETED
            await manager.save(activeBooking)

            planToActivate.status = UserPlanStatus.ACTIVE
            planToActivate.startsAt = new Date()
            planToActivate.expiresAt = addDays(
                planToActivate.startsAt,
                Number(planToActivate.planSnapshot.validityDays),
            )
            planToActivate.remainingKm = Number(planToActivate.remainingKm) + carryForwardKm
            planToActivate.totalKm = Number(planToActivate.totalKm) + carryForwardKm
            await manager.save(planToActivate)

            newBooking.vehicleId = activeBooking.vehicleId
            newBooking.batteryId = activeBooking.batteryId
            newBooking.stationId = activeBooking.stationId
            newBooking.status = BookingStatus.ONGOING
            await manager.save(newBooking)

            await this.generateAndUploadQrCode(
                manager,
                planToActivate,
                activeBooking.vehicleId,
                activeBooking.batteryId,
            )

            return planToActivate
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
