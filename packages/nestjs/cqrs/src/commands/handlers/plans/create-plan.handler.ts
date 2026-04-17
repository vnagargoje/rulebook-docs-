import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { PlanEntity } from '@yugo/nestjs-database/entities'
import { EntityManager } from 'typeorm'
import { CreatePlanCommand } from '../../impl/plans/create-plan.command.js'

@CommandHandler(CreatePlanCommand)
export class CreatePlanHandler implements ICommandHandler<CreatePlanCommand> {
    private readonly logger = new Logger(CreatePlanHandler.name)

    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: CreatePlanCommand) {
        const { payload } = command

        this.logger.log(`Creating plan: ${payload.name}`)

        const plan = this.manager.create(PlanEntity, {
            name: payload.name,
            description: payload.description,
            validityDays: payload.validityDays,
            kmLimit: payload.kmLimit,
            price: payload.price,
            deposit: payload.deposit,
            active: payload.active ?? true,
        })

        return this.manager.save(plan)
    }
}
