import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BatteryEntity } from '@yugo/nestjs-database/entities'
import { BatteryStatus } from '@yugo/shared'
import { UpdateBatteryStatusCommand } from 'src/commands/impl'
import { DataSource } from 'typeorm'

const VALID_TRANSITIONS: Record<string, BatteryStatus[]> = {
    [BatteryStatus.DRAINED]: [BatteryStatus.CHARGING],
    [BatteryStatus.CHARGING]: [BatteryStatus.CHARGED],
}

@CommandHandler(UpdateBatteryStatusCommand)
export class UpdateBatteryStatusHandler implements ICommandHandler<UpdateBatteryStatusCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: UpdateBatteryStatusCommand) {
        const { batteryId, status } = command
        const manager = this.datasource.manager

        const battery = await manager.findOne(BatteryEntity, {
            where: { id: batteryId },
        })
        if (!battery) {
            throw new NotFoundException('Battery not found')
        }

        const allowedTransitions = VALID_TRANSITIONS[battery.status]
        if (!allowedTransitions || !allowedTransitions.includes(status)) {
            throw new BadRequestException(`Cannot transition battery from '${battery.status}' to '${status}'`)
        }

        battery.status = status
        await manager.save(battery)

        return manager.findOne(BatteryEntity, {
            where: { id: battery.id },
            relations: ['station'],
        })
    }
}
