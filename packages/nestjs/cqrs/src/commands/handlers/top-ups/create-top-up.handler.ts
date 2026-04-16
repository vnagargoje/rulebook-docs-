import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { TopUpEntity } from '@yugo/nestjs-database/entities'
import { EntityManager } from 'typeorm'
import { CreateTopUpCommand } from '../../impl/top-ups/create-top-up.command.js'

@CommandHandler(CreateTopUpCommand)
export class CreateTopUpHandler implements ICommandHandler<CreateTopUpCommand> {
    private readonly logger = new Logger(CreateTopUpHandler.name)

    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: CreateTopUpCommand) {
        const { payload } = command

        this.logger.log(`Creating top-up: ${payload.name}`)

        const topUp = this.manager.create(TopUpEntity, {
            name: payload.name,
            description: payload.description,
            validityDays: payload.validityDays,
            kmLimit: payload.kmLimit,
            price: payload.price,
            active: payload.active ?? true,
        })

        return this.manager.save(topUp)
    }
}
