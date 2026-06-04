import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BatteryEntity, StationEntity } from '@yugo/nestjs-database/entities'
import { BatteryStatus } from '@yugo/shared'
import { UpdateBatteryCommand } from '../../impl/batteries/update-battery.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(UpdateBatteryCommand)
export class UpdateBatteryHandler implements ICommandHandler<UpdateBatteryCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) { }

    async execute(command: UpdateBatteryCommand) {
        const { batteryId, payload } = command
        const battery = await this.manager.findOne(BatteryEntity, {
            where: { id: batteryId },
        })
        if (!battery) {
            throw new NotFoundException('Battery not found')
        }

        const currentStatus = battery.status
        const newStatus = payload.status

        if (newStatus !== undefined && currentStatus !== newStatus) {
            const VALID_TRANSITIONS: Record<string, BatteryStatus[]> = {
                [BatteryStatus.AVAILABLE]: [BatteryStatus.UNDER_MAINTENANCE],
                [BatteryStatus.UNDER_MAINTENANCE]: [BatteryStatus.AVAILABLE],
            }

            const allowedTransitions = VALID_TRANSITIONS[currentStatus]
            if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
                throw new BadRequestException(`Cannot transition battery from '${currentStatus}' to '${newStatus}'`)
            }

            if (newStatus === BatteryStatus.UNDER_MAINTENANCE) {
                battery.stationId = null as any
                payload.stationId = null as any
            }

            if (currentStatus === BatteryStatus.UNDER_MAINTENANCE && newStatus === BatteryStatus.AVAILABLE) {
                const targetStationId = payload.stationId || battery.stationId
                if (!targetStationId) {
                    throw new BadRequestException('Station assignment is mandatory when transitioning battery from under maintenance to available')
                }
                const station = await this.manager.findOne(StationEntity, {
                    where: { id: targetStationId },
                })
                if (!station) {
                    throw new BadRequestException('Assigned station not found')
                }
                battery.stationId = targetStationId
            }

            battery.status = newStatus
            await this.manager.save(battery)
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
