import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { TopUpEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { CreateTopUpCommand } from '../../impl/top-ups/create-top-up.command.js'

@CommandHandler(CreateTopUpCommand)
export class CreateTopUpHandler implements ICommandHandler<CreateTopUpCommand> {
    private readonly logger = new Logger(CreateTopUpHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreateTopUpCommand) {
        const { payload } = command
        const manager = this.datasource.manager

        this.logger.log(`Creating top-up: ${payload.name}`)

        const topUp = manager.create(TopUpEntity, {
            name: payload.name,
            description: payload.description,
            validityDays: payload.validityDays,
            kmLimit: payload.kmLimit,
            gstPercentage: payload.gstPercentage,
            price: payload.price,
            active: payload.active ?? true,
        })

        return manager.save(topUp)
    }
}
