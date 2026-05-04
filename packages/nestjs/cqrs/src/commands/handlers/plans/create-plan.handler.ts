import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { PlanEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { CreatePlanCommand } from '../../impl/plans/create-plan.command.js'

@CommandHandler(CreatePlanCommand)
export class CreatePlanHandler implements ICommandHandler<CreatePlanCommand> {
    private readonly logger = new Logger(CreatePlanHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreatePlanCommand) {
        const { payload } = command
        const manager = this.datasource.manager

        this.logger.log(`Creating plan: ${payload.name}`)

        const plan = manager.create(PlanEntity, {
            name: payload.name,
            description: payload.description,
            validityDays: payload.validityDays,
            kmLimit: payload.kmLimit,
            price: payload.price,
            deposit: payload.deposit,
            gst: payload.gst,
            registrationFee: payload.registrationFee ?? 0,
            active: payload.active ?? true,
        })

        return manager.save(plan)
    }
}
