import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { TopUpEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { UpdateTopUpCommand } from '../../impl/top-ups/update-top-up.command.js'

@CommandHandler(UpdateTopUpCommand)
export class UpdateTopUpHandler implements ICommandHandler<UpdateTopUpCommand> {
    private readonly logger = new Logger(UpdateTopUpHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: UpdateTopUpCommand) {
        const { topUpId, payload } = command
        const manager = this.datasource.manager

        const topUp = await manager.findOne(TopUpEntity, { where: { id: topUpId } })
        if (!topUp) {
            throw new NotFoundException('Top-up not found')
        }

        this.logger.log(`Updating top-up: ${topUpId}`)

        Object.assign(topUp, payload)
        return manager.save(topUp)
    }
}
