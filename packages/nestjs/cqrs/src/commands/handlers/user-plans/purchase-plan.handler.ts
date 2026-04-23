import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { PlanEntity, TransactionEntity, UserEntity, UserPlanEntity } from '@yugo/nestjs-database/entities'
import { PaymentStatus, UserPlanStatus } from '@yugo/shared'
import Razorpay from 'razorpay'
import { DataSource, EntityManager, In } from 'typeorm'
import { RazorpayConfig } from '../../../types.js'
import { PurchasePlanCommand } from '../../impl/user-plans/purchase-plan.command.js'

@CommandHandler(PurchasePlanCommand)
export class PurchasePlanHandler implements ICommandHandler<PurchasePlanCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: PurchasePlanCommand) {
        const { userId, planId } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<RazorpayConfig>('razorpay.config')

        const user = await manager.findOne(UserEntity, { where: { id: userId } })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return manager.transaction(async (manager) => {
            // const kycs = await manager.find(UserKycEntity, { where: { userId } })
            // const hasApprovedKyc = kycs.some((k) => k.status === KycStatus.APPROVED || k.status === KycStatus.VERIFIED)
            // if (!hasApprovedKyc) {
            //     throw new BadRequestException('KYC verification is required before purchasing a plan')
            // }

            const pendingPlan = await manager.findOne(UserPlanEntity, {
                where: { userId, status: UserPlanStatus.PENDING },
            })

            if (pendingPlan && pendingPlan.planId === planId) {
                return this.reusePendingPlan(manager, pendingPlan, config)
            }

            if (pendingPlan) {
                await manager.update(
                    TransactionEntity,
                    { userPlanId: pendingPlan.id, status: PaymentStatus.AWAITING },
                    { status: PaymentStatus.CANCELLED },
                )
                pendingPlan.status = UserPlanStatus.CANCELLED
                await manager.save(pendingPlan)
            }

            const activePlan = await manager.findOne(UserPlanEntity, {
                where: {
                    userId,
                    status: In([UserPlanStatus.PURCHASED, UserPlanStatus.ACTIVE]),
                },
            })
            if (activePlan) {
                throw new BadRequestException(
                    'You already have an active plan. Complete or cancel it before purchasing a new one',
                )
            }

            const plan = await manager.findOne(PlanEntity, { where: { id: planId, active: true } })
            if (!plan) {
                throw new NotFoundException('Plan not found or this plan is no longer available')
            }

            const { totalAmount, planSnapshot } = this.buildPlanSnapshot(
                plan,
                userId,
                await this.isFirstTimePurchase(manager, userId),
            )

            const userPlan = manager.create(UserPlanEntity, {
                userId,
                planId,
                planSnapshot,
                status: UserPlanStatus.PENDING,
                remainingKm: plan.kmLimit,
            })
            await manager.save(userPlan)
            return this.createRazorpayOrderAndTransaction(manager, config, userPlan, totalAmount, userId, planId)
        })
    }

    private async reusePendingPlan(manager: EntityManager, userPlan: UserPlanEntity, config: RazorpayConfig) {
        const transaction = await manager.findOne(TransactionEntity, {
            where: { userPlanId: userPlan.id, status: PaymentStatus.AWAITING },
        })

        if (transaction) {
            return {
                razorpayOrderId: transaction.razorpayOrderId,
                amount: Math.round(Number(transaction.amount) * 100),
                currency: transaction.currency,
                key: config.apiKey,
                userPlanId: userPlan.id,
            }
        }

        return this.createRazorpayOrderAndTransaction(
            manager,
            config,
            userPlan,
            Number(userPlan.planSnapshot.totalAmount),
            userPlan.userId,
            userPlan.planId,
        )
    }

    private async isFirstTimePurchase(manager: EntityManager, userId: string) {
        const count = await manager.count(UserPlanEntity, { where: { userId, status: UserPlanStatus.EXPIRED } })
        return count === 0
    }

    private buildPlanSnapshot(plan: PlanEntity, userId: string, isFirstTime: boolean) {
        const totalAmount =
            Number(plan.price) +
            Number(plan.deposit) +
            Number(plan.gst) +
            (isFirstTime ? Number(plan.registrationFee) : 0)

        const planSnapshot = {
            name: plan.name,
            description: plan.description,
            validityDays: plan.validityDays,
            kmLimit: plan.kmLimit,
            price: plan.price,
            deposit: plan.deposit,
            gst: plan.gst,
            registrationFee: isFirstTime ? plan.registrationFee : 0,
            totalAmount,
        }

        return { totalAmount, planSnapshot }
    }

    private async createRazorpayOrderAndTransaction(
        manager: EntityManager,
        config: RazorpayConfig,
        userPlan: UserPlanEntity,
        totalAmount: number,
        userId: string,
        planId: string,
    ) {
        const razorpay = new Razorpay({
            key_id: config.apiKey,
            key_secret: config.apiSecret,
        })

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
            receipt: userPlan.id,
            notes: {
                userId,
                planId,
                userPlanId: userPlan.id,
            },
        })

        const transaction = manager.create(TransactionEntity, {
            userPlanId: userPlan.id,
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
            userPlanId: userPlan.id,
        }
    }
}
