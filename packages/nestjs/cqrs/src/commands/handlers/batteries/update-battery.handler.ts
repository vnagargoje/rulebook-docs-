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

        const { properties, ...otherFields } = payload

        const updateQuery = this.manager.createQueryBuilder(BatteryEntity, 'battery')
            .update()
            .where('id = :id', { id: batteryId })

        const setValues: any = {}
        for (const [key, value] of Object.entries(otherFields)) {
            if (value !== undefined) {
                setValues[key] = value
            }
        }

        if (properties !== undefined) {
            setValues.properties = () => `JSON_MERGE_PATCH(COALESCE(properties, JSON_OBJECT()), :propertiesJson)`
            updateQuery.setParameter('propertiesJson', JSON.stringify(properties))
        }

        if (Object.keys(setValues).length > 0) {
            updateQuery.set(setValues)
            await updateQuery.execute()
        }

        return this.manager.findOne(BatteryEntity, {
            where: { id: batteryId },
            relations: { station: true },
        })
    }
}
