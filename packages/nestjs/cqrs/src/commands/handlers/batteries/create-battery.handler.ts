import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BatteryEntity } from '@yugo/nestjs-database/entities'
import { CreateBatteryCommand } from 'src/commands/impl/batteries/create-battery.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(CreateBatteryCommand)
export class CreateBatteryHandler implements ICommandHandler<CreateBatteryCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: CreateBatteryCommand) {
        const { payload } = command

        return this.manager.transaction(async (manager) => {
            const battery = manager.create(BatteryEntity, {
                batteryQrId: payload.batteryQrId,
                gpsId: payload.gpsId,
                properties: payload.properties,
                stationId: payload.stationId,
                range: payload.range,
            })

            await manager.save(battery)

            return manager.findOne(BatteryEntity, {
                where: { id: battery.id },
                relations: { station: true },
            })
        })
    }
}
