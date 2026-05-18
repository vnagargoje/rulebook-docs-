import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { TopUpEntity, UserPlanEntity, UserTopUpEntity } from '@yugo/nestjs-database/entities'
import { UserPlanStatus, UserTopUpStatus } from '@yugo/shared'
import { DataSource } from 'typeorm'
import { ApplyTopUpCommand } from '../../impl/user-top-ups/apply-top-up.command.js'

@CommandHandler(ApplyTopUpCommand)
export class ApplyTopUpHandler implements ICommandHandler<ApplyTopUpCommand> {
    private readonly logger = new Logger(ApplyTopUpHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: ApplyTopUpCommand) {
        const { userId, topUpId, userPlanId } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const topUp = await manager.findOne(TopUpEntity, { where: { id: topUpId } })
            if (!topUp || !topUp.active) {
                throw new BadRequestException('Top-up not found or this top-up is no longer available')
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
            const topUpTotalAmount = Math.ceil(basePrice + gstAmount)
            const userTopUp = manager.create(UserTopUpEntity, {
                userId,
                userPlanId,
                topUpId,
                topUpSnapshot: {
                    name: topUp.name,
                    description: topUp.description,
                    kmLimit: topUp.kmLimit,
                    price: topUp.price,
                    gstPercentage,
                    gstAmount,
                },
                status: UserTopUpStatus.APPLIED,
                appliedAt: new Date(),
            })
            await manager.save(userTopUp)
            this.logger.log(
                `[MOCK PAYMENT] User ${userId} top-up payment of ₹${topUpTotalAmount} processed for top-up "${topUp.name}"`,
            )
            userPlan.remainingKm = Number(userPlan.remainingKm) + Number(topUp.kmLimit)
            userPlan.totalKm = Number(userPlan.totalKm) + Number(topUp.kmLimit)

            await manager.save(userPlan)
            this.logger.log(`Top-up ${topUpId} applied to user plan ${userPlanId}`)
            return userPlan
        })
    }
}
