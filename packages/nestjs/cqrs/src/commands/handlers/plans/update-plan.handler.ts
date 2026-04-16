import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { PlanEntity } from '@yugo/nestjs-database/entities'
import { EntityManager } from 'typeorm'
import { UpdatePlanCommand } from '../../impl/plans/update-plan.command.js'

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanHandler implements ICommandHandler<UpdatePlanCommand> {
    private readonly logger = new Logger(UpdatePlanHandler.name)

    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: UpdatePlanCommand) {
        const { planId, payload } = command

        const plan = await this.manager.findOne(PlanEntity, { where: { id: planId } })
        if (!plan) {
            throw new NotFoundException('Plan not found')
        }

        this.logger.log(`Updating plan: ${planId}`)

        Object.assign(plan, payload)
        return this.manager.save(plan)
    }
}
