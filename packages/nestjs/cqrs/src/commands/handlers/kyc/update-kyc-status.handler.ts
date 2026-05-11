import { ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserKycEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { UpdateKycStatusCommand } from '../../impl/kyc/update-kyc-status.command.js'
import { NotFoundException } from '@nestjs/common'
import { KycStatus } from '@yugo/shared'

@CommandHandler(UpdateKycStatusCommand)
export class UpdateKycStatusHandler implements ICommandHandler<UpdateKycStatusCommand> {
    constructor(
        @InjectDataSource()
        private readonly datasource: DataSource,
    ) {}

    async execute(command: UpdateKycStatusCommand) {
        const { id, status, notes } = command
        const manager = this.datasource.manager

        const kyc = await manager.findOne(UserKycEntity, { where: { id } })
        if (!kyc) {
            throw new NotFoundException('KYC record not found')
        }

        kyc.status = status
        if (notes) {
            kyc.notes = notes
        }
        if (status === KycStatus.VERIFIED) {
            kyc.verifiedAt = new Date()
        }

        await manager.save(kyc)

        return {
            success: true,
            message: `KYC status updated to ${status}`,
        }
    }
}
