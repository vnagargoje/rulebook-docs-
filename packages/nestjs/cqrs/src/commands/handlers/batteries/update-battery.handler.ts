import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BatteryEntity } from '@yugo/nestjs-database/entities'
import { UpdateBatteryCommand } from '../../impl/batteries/update-battery.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(UpdateBatteryCommand)
export class UpdateBatteryHandler implements ICommandHandler<UpdateBatteryCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: UpdateBatteryCommand) {
        const { batteryId, payload } = command
        const battery = await this.manager.findOne(BatteryEntity, {
            where: { id: batteryId },
        })
        if (!battery) {
            throw new Error('Battery not found')
        }

        Object.assign(battery, payload)
        await this.manager.save(battery)

        return this.manager.findOne(BatteryEntity, {
            where: { id: batteryId },
            relations: { station: true },
        })
    }
}
