import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BookingEntity, TransactionEntity, UserPlanEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus, PaymentStatus, UserPlanStatus } from '@yugo/shared'
import { createHmac, randomInt } from 'crypto'
import { RazorpayConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import { VerifyPaymentCommand } from '../../impl/user-plans/verify-payment.command.js'
import { InjectInngestService } from '@yugo/nestjs-inngest'
import { type HenchmenInngestClient } from '@yugo/utils'

@CommandHandler(VerifyPaymentCommand)
export class VerifyPaymentHandler implements ICommandHandler<VerifyPaymentCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
        @InjectInngestService() private readonly inngest: HenchmenInngestClient,
    ) {}

    async execute(command: VerifyPaymentCommand) {
        const { userId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<RazorpayConfig>('razorpay.config')

        return manager.transaction(async (manager) => {
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
                throw new BadRequestException({
                    code: 'PAYMENT_ALREADY_PROCESSED',
                    message: 'This payment has already been processed',
                })
            }

            const expectedSignature = createHmac('sha256', config.apiSecret)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex')

            if (expectedSignature !== razorpaySignature) {
                transaction.status = PaymentStatus.FAILED
                transaction.razorpayPaymentId = razorpayPaymentId
                await manager.save(transaction)
                // Keep plan in PENDING so the user can retry (don't permanently lock them out).
                throw new BadRequestException('Payment verification failed. Invalid signature')
            }

            transaction.status = PaymentStatus.SUCCEEDED
            transaction.razorpayPaymentId = razorpayPaymentId
            transaction.razorpaySignature = razorpaySignature
            await manager.save(transaction)

            transaction.userPlan.status = UserPlanStatus.PURCHASED
            await manager.save(transaction.userPlan)

            const activePlan = await manager.findOne(UserPlanEntity, {
                where: { userId, status: UserPlanStatus.ACTIVE },
            })

            let hasOngoingBooking = false
            if (activePlan) {
                const activeBooking = await manager.findOne(BookingEntity, {
                    where: { userPlanId: activePlan.id, status: BookingStatus.ONGOING },
                })
                hasOngoingBooking = !!activeBooking

                if (activePlan.expiresAt) {
                    await this.inngest.send({
                        name: 'plan/userPlan.activate',
                        data: {
                            userId,
                            userPlanId: transaction.userPlan.id,
                        },
                        ts: activePlan.expiresAt.getTime(),
                    })
                }
            }

            if (!hasOngoingBooking) {
                const pickupOtp = String(randomInt(1000, 10000))
                const booking = manager.create(BookingEntity, {
                    userPlanId: transaction.userPlan.id,
                    stationId: transaction.userPlan.planSnapshot?.stationId,
                    vehicleId: null,
                    batteryId: null,
                    status: BookingStatus.CREATED,
                    pickupOtp,
                })
                await manager.save(booking)

                const fullBooking = await manager.findOne(BookingEntity, {
                    where: { id: booking.id },
                    relations: ['userPlan', 'userPlan.user', 'station'],
                })

                if (!fullBooking) {
                    throw new NotFoundException('Booking not found after creation')
                }

                await this.inngest.send({
                    name: 'booking/booking.create',
                    data: {
                        userId,
                        booking: fullBooking,
                    },
                })
            }
            return transaction.userPlan
        })
    }
}
