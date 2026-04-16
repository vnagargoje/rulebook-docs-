import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { TopUpEntity } from '@yugo/nestjs-database/entities'
import { EntityManager } from 'typeorm'
import { UpdateTopUpCommand } from '../../impl/top-ups/update-top-up.command.js'

@CommandHandler(UpdateTopUpCommand)
export class UpdateTopUpHandler implements ICommandHandler<UpdateTopUpCommand> {
    private readonly logger = new Logger(UpdateTopUpHandler.name)

    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: UpdateTopUpCommand) {
        const { topUpId, payload } = command

        const topUp = await this.manager.findOne(TopUpEntity, { where: { id: topUpId } })
        if (!topUp) {
            throw new NotFoundException('Top-up not found')
        }

        this.logger.log(`Updating top-up: ${topUpId}`)

        Object.assign(topUp, payload)
        return this.manager.save(topUp)
    }
}
