import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BookingEntity, TransactionEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus, PaymentStatus, UserPlanStatus } from '@yugo/shared'
import { createHmac, randomInt } from 'crypto'
import { DataSource } from 'typeorm'
import { RazorpayConfig } from '../../../types.js'
import { VerifyPaymentCommand } from '../../impl/user-plans/verify-payment.command.js'

@CommandHandler(VerifyPaymentCommand)
export class VerifyPaymentHandler implements ICommandHandler<VerifyPaymentCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: VerifyPaymentCommand) {
        const { userId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<RazorpayConfig>('razorpay.config')

        return manager.transaction(async (manager) => {
            const transaction = await manager.findOne(TransactionEntity, {
                where: { razorpayOrderId },
                relations: ['userPlan'],
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

                transaction.userPlan.status = UserPlanStatus.FAILED
                await manager.save(transaction.userPlan)

                throw new BadRequestException('Payment verification failed. Invalid signature')
            }

            transaction.status = PaymentStatus.SUCCEEDED
            transaction.razorpayPaymentId = razorpayPaymentId
            transaction.razorpaySignature = razorpaySignature
            await manager.save(transaction)

            transaction.userPlan.status = UserPlanStatus.PURCHASED
            await manager.save(transaction.userPlan)

            const pickupOtp = String(randomInt(1000, 10000))
            const booking = manager.create(BookingEntity, {
                userPlanId: transaction.userPlan.id,
                stationId: null,
                vehicleId: null,
                batteryId: null,
                status: BookingStatus.CREATED,
                pickupOtp,
            })
            await manager.save(booking)
            return transaction.userPlan
        })
    }
}
