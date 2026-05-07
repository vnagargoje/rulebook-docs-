import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserPlanEntity } from '@yugo/nestjs-database/entities'
import { UserPlanStatus, REGITRATION_FEE } from '@yugo/shared'
import { DataSource, In } from 'typeorm'
import { GetAccuratePlanPricesQuery } from '../../impl/plans/get-accurate-plan-prices.query.js'

@QueryHandler(GetAccuratePlanPricesQuery)
export class GetAccuratePlanPricesHandler implements IQueryHandler<GetAccuratePlanPricesQuery> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(query: GetAccuratePlanPricesQuery) {
        const { plans, userId } = query
        const manager = this.datasource.manager

        let isFirstTime = true
        if (userId) {
            const count = await manager.count(UserPlanEntity, {
                where: {
                    userId,
                    status: In([UserPlanStatus.PURCHASED, UserPlanStatus.ACTIVE, UserPlanStatus.EXPIRED]),
                },
            })
            isFirstTime = count === 0
        }

        return plans.map((plan) => {
            const basePrice = Number(plan.price)
            const deposit = Number(plan.deposit || 0)
            const registrationFee = isFirstTime ? REGITRATION_FEE : 0
            const gstPercentage = Number(plan.gstPercentage || 0)

            const taxableAmount = basePrice + registrationFee
            const gstAmount = (taxableAmount * gstPercentage) / 100

            plan.totalAmount = Math.ceil(basePrice + deposit + registrationFee + gstAmount)
            plan.registrationFee = registrationFee

            return plan
        })
    }
}
