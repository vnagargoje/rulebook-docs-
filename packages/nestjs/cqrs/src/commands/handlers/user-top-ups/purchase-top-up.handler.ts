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
import Razorpay from 'razorpay'
import { RazorpayConfig } from 'src/types/index.js'
import { DataSource, IsNull } from 'typeorm'
import { PurchaseTopUpCommand } from '../../impl/user-top-ups/purchase-top-up.command.js'

@CommandHandler(PurchaseTopUpCommand)
export class PurchaseTopUpHandler implements ICommandHandler<PurchaseTopUpCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: PurchaseTopUpCommand) {
        const { userId, topUpId, userPlanId } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<RazorpayConfig>('razorpay.config')

        return manager.transaction(async (manager) => {
            const topUp = await manager.findOne(TopUpEntity, { where: { id: topUpId, active: true } })
            if (!topUp) {
                throw new NotFoundException('Top-up not found or no longer available')
            }

            const userPlan = await manager.findOne(UserPlanEntity, {
                where: { id: userPlanId, userId },
            })
            if (!userPlan || userPlan.status !== UserPlanStatus.ACTIVE) {
                throw new BadRequestException('User plan not found or not active')
            }

            const basePrice = Number(topUp.price)
            const gstPercentage = Number(topUp.gstPercentage || 0)
            const gstAmount = (basePrice * gstPercentage) / 100
            const totalAmount = Math.ceil(basePrice + gstAmount)

            // Snapshot is built at order-creation time so details are visible even for
            // AWAITING / FAILED transactions (before payment completes).
            const topUpSnapshot = {
                name: topUp.name,
                description: topUp.description,
                kmLimit: topUp.kmLimit,
                price: topUp.price,
                gstPercentage,
                gstAmount,
            }

            // --- Idempotency (mirrors plan-purchase pattern) ---
            // Look for an existing unapplied stub for this user-plan + top-up combination.
            // A stub with appliedAt=null means a previous payment was either still in
            // progress (AWAITING) or already failed. We always reuse the same stub so
            // no orphaned records accumulate across retries.
            let userTopUp = await manager.findOne(UserTopUpEntity, {
                where: { userPlanId, topUpId, appliedAt: IsNull() },
                lock: { mode: 'pessimistic_write' },
            })

            if (userTopUp) {
                // If an AWAITING transaction already exists for this stub, return its
                // Razorpay order so Razorpay can re-open the same payment sheet.
                const awaitingTx = await manager.findOne(TransactionEntity, {
                    where: { userTopUpId: userTopUp.id, status: PaymentStatus.AWAITING },
                })
                if (awaitingTx) {
                    return {
                        razorpayOrderId: awaitingTx.razorpayOrderId,
                        amount: Math.round(Number(awaitingTx.amount) * 100),
                        currency: awaitingTx.currency,
                        key: config.apiKey,
                        userPlanId,
                    }
                }

                // Previous payment failed — ensure the snapshot is populated on the stub
                // (it may be null if it was created before this fix was deployed).
                if (!userTopUp.topUpSnapshot) {
                    userTopUp.topUpSnapshot = topUpSnapshot
                    await manager.save(userTopUp)
                }
            } else {
                // First attempt — create the stub with the snapshot already filled in.
                userTopUp = manager.create(UserTopUpEntity, {
                    userId,
                    userPlanId,
                    topUpId,
                    topUpSnapshot,
                    status: UserTopUpStatus.AWAITING,
                    appliedAt: null,
                })
                await manager.save(userTopUp)
            }

            // Create a new Razorpay order and transaction (either first attempt or retry
            // after a failed payment).
            const razorpay = new Razorpay({
                key_id: config.apiKey,
                key_secret: config.apiSecret,
            })

            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: 'INR',
                receipt: userPlanId,
                notes: { userId, topUpId, userPlanId },
            })

            const transaction = manager.create(TransactionEntity, {
                userPlanId,
                userTopUpId: userTopUp.id,
                razorpayOrderId: razorpayOrder.id,
                amount: totalAmount,
                currency: 'INR',
                status: PaymentStatus.AWAITING,
                notes: JSON.stringify(razorpayOrder),
            })
            await manager.save(transaction)

            return {
                razorpayOrderId: razorpayOrder.id,
                amount: Math.round(totalAmount * 100),
                currency: 'INR',
                key: config.apiKey,
                userPlanId,
            }
        })
    }
}
