import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { PlanEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { UpdatePlanCommand } from '../../impl/plans/update-plan.command.js'

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanHandler implements ICommandHandler<UpdatePlanCommand> {
    private readonly logger = new Logger(UpdatePlanHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: UpdatePlanCommand) {
        const { planId, payload } = command
        const manager = this.datasource.manager

        const plan = await manager.findOne(PlanEntity, { where: { id: planId } })
        if (!plan) {
            throw new NotFoundException('Plan not found')
        }

        this.logger.log(`Updating plan: ${planId}`)

        Object.assign(plan, payload)
        return manager.save(plan)
    }
}
