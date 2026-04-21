import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BookingEntity, PlanEntity, UserEntity, UserPlanEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus, UserPlanStatus } from '@yugo/shared'
import { randomInt } from 'crypto'
import { DataSource, In } from 'typeorm'
import { PurchasePlanCommand } from '../../impl/user-plans/purchase-plan.command.js'

@CommandHandler(PurchasePlanCommand)
export class PurchasePlanHandler implements ICommandHandler<PurchasePlanCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

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

            const existingActivePlan = await manager.findOne(UserPlanEntity, {
                where: {
                    userId,
                    status: In([UserPlanStatus.PENDING, UserPlanStatus.ACTIVE]),
                },
            })
            if (existingActivePlan) {
                throw new BadRequestException(
                    'You already have an active plan. Complete or cancel it before purchasing a new one',
                )
            }

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
                status: UserPlanStatus.PURCHASED,
                remainingKm: plan.kmLimit,
            })
            await manager.save(userPlan)

            const pickupOtp = String(randomInt(1000, 10000))

            const booking = manager.create(BookingEntity, {
                userPlanId: userPlan.id,
                stationId: null,
                vehicleId: null,
                batteryId: null,
                status: BookingStatus.CREATED,
                pickupOtp,
            })
            await manager.save(booking)
            return userPlan
        })
    }
}
