import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import {
    TopUpEntity,
    TransactionEntity,
    UserPlanEntity,
    UserTopUpEntity,
} from '@yugo/nestjs-database/entities'
import { PaymentStatus, UserPlanStatus, UserTopUpStatus } from '@yugo/shared'
import { createHmac } from 'crypto'
import { RazorpayConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import { VerifyTopUpPaymentCommand } from '../../impl/user-top-ups/verify-top-up-payment.command.js'

@CommandHandler(VerifyTopUpPaymentCommand)
export class VerifyTopUpPaymentHandler implements ICommandHandler<VerifyTopUpPaymentCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: VerifyTopUpPaymentCommand) {
        const { userId, razorpayOrderId, razorpayPaymentId, razorpaySignature, topUpId, userPlanId } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<RazorpayConfig>('razorpay.config')

        return manager.transaction(async (manager) => {
            // Pessimistic lock prevents race with webhook payment.captured
            const transaction = await manager.findOne(TransactionEntity, {
                where: { razorpayOrderId },
                relations: ['userPlan'],
                lock: { mode: 'pessimistic_write' },
            })
            if (!transaction) {
                throw new NotFoundException('Transaction not found')
            }

            if (transaction.userPlan.userId !== userId) {
                throw new BadRequestException('Transaction does not belong to this user')
            }

            if (transaction.status !== PaymentStatus.AWAITING) {
                throw new BadRequestException('This payment has already been processed')
            }

            const expectedSignature = createHmac('sha256', config.apiSecret)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex')

            if (expectedSignature !== razorpaySignature) {
                transaction.status = PaymentStatus.FAILED
                transaction.razorpayPaymentId = razorpayPaymentId
                await manager.save(transaction)
                // Mark the stub as failed so the frontend can filter it cleanly
                const failedStub = await manager.findOne(UserTopUpEntity, { where: { id: transaction.userTopUpId! } })
                if (failedStub) {
                    failedStub.status = UserTopUpStatus.FAILED
                    await manager.save(failedStub)
                }
                throw new BadRequestException('Payment verification failed. Invalid signature')
            }

            // Load the stub created at order time — use IDs from it, not client body
            // (prevents substituting a cheaper topUpId from the client)
            const userTopUp = await manager.findOne(UserTopUpEntity, { where: { id: transaction.userTopUpId! } })
            if (!userTopUp) {
                throw new NotFoundException('UserTopUp record not found')
            }

            // Use values from the stored stub, not the client-supplied command
            const resolvedTopUpId = userTopUp.topUpId
            const resolvedUserPlanId = userTopUp.userPlanId

            const topUp = await manager.findOne(TopUpEntity, { where: { id: resolvedTopUpId } })
            if (!topUp) {
                throw new NotFoundException('Top-up not found')
            }

            const userPlan = await manager.findOne(UserPlanEntity, {
                where: { id: resolvedUserPlanId, userId },
            })
            if (!userPlan || userPlan.status !== UserPlanStatus.ACTIVE) {
                throw new BadRequestException('User plan not found or not active. If your plan has expired, please contact support for a refund.')
            }

            // All validations passed — now persist the SUCCEEDED status.
            transaction.status = PaymentStatus.SUCCEEDED
            transaction.razorpayPaymentId = razorpayPaymentId
            transaction.razorpaySignature = razorpaySignature
            await manager.save(transaction)

            // Reuse the snapshot already set at order-creation time; only rebuild if
            // missing (handles legacy stubs created before snapshot pre-filling was added).
            const topUpSnapshot = userTopUp.topUpSnapshot ?? {
                name: topUp.name,
                description: topUp.description,
                validityDays: topUp.validityDays,
                kmLimit: topUp.kmLimit,
                price: topUp.price,
                gst: topUp.gst,
                totalAmount: Number(topUp.price) + Number(topUp.gst),
            }

            userTopUp.topUpSnapshot = topUpSnapshot
            userTopUp.status = UserTopUpStatus.APPLIED
            userTopUp.appliedAt = new Date()
            await manager.save(userTopUp)

            userPlan.remainingKm = Number(userPlan.remainingKm) + Number(topUp.kmLimit)
            userPlan.totalKm = Number(userPlan.totalKm) + Number(topUp.kmLimit)
            if (userPlan.expiresAt && topUp.validityDays > 0) {
                const newExpiry = new Date(userPlan.expiresAt)
                newExpiry.setDate(newExpiry.getDate() + topUp.validityDays)
                userPlan.expiresAt = newExpiry
            }
            await manager.save(userPlan)

            return userPlan
        })
    }
}
