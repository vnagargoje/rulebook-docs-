import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Logger, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { FileEntity, PlanEntity, UserEntity, UserPlanEntity } from '@yugo/nestjs-database/entities'
import { UserPlanStatus } from '@yugo/shared'
import { toBuffer } from 'qrcode'
import { DataSource } from 'typeorm'
import { PurchasePlanCommand } from '../../impl/user-plans/purchase-plan.command.js'

@CommandHandler(PurchasePlanCommand)
export class PurchasePlanHandler implements ICommandHandler<PurchasePlanCommand> {
    private readonly logger = new Logger(PurchasePlanHandler.name)
    private readonly s3Client: S3Client

    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {
        const s3Config = this.configService.getOrThrow('s3-client.config')
        this.s3Client = new S3Client(s3Config)
    }

    async execute(command: PurchasePlanCommand) {
        const { userId, planId } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const user = await manager.findOne(UserEntity, { where: { id: userId } })
            if (!user) {
                throw new NotFoundException('User not found')
            }

            // const kycs = await manager.find(UserKycEntity, { where: { userId } })
            // const hasApprovedKyc = kycs.some((k) => k.status === KycStatus.APPROVED || k.status === KycStatus.VERIFIED)
            // if (!hasApprovedKyc) {
            //     throw new BadRequestException('KYC verification is required before purchasing a plan')
            // }

            const plan = await manager.findOne(PlanEntity, { where: { id: planId } })
            if (!plan || !plan.active) {
                throw new NotFoundException('Plan not found or this plan is no longer available')
            }

            const existingPlanCount = await manager.count(UserPlanEntity, { where: { userId } })
            const isFirstTimePurchase = existingPlanCount === 0
            const totalAmount =
                Number(plan.price) +
                Number(plan.deposit) +
                Number(plan.gst) +
                (isFirstTimePurchase ? Number(plan.registrationFee) : 0)

            const planSnapshot = {
                name: plan.name,
                description: plan.description,
                validityDays: plan.validityDays,
                kmLimit: plan.kmLimit,
                price: plan.price,
                deposit: plan.deposit,
                gst: plan.gst,
                registrationFee: isFirstTimePurchase ? plan.registrationFee : 0,
                totalAmount,
            }

            const userPlan = manager.create(UserPlanEntity, {
                userId,
                planId,
                planSnapshot,
                status: UserPlanStatus.ACTIVE,
                remainingKm: plan.kmLimit,
            })
            await manager.save(userPlan)

            this.logger.log(
                `[MOCK PAYMENT] User ${userId} payment of ₹${totalAmount} processed for plan "${plan.name}"`,
            )
            this.logger.log(`User ${userId} purchased plan ${planId}, userPlan: ${userPlan.id}`)

            const qrPayload = JSON.stringify({
                upi: userPlan.id,
                uid: userId,
                pn: plan.name,
                km: plan.kmLimit,
                amt: totalAmount,
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

            return userPlan
        })
    }
}
