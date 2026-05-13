import { ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserKycEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { ApplyManualKycCommand } from '../../impl/kyc/apply-manual-kyc.command.js'
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { KycStatus } from '@yugo/shared'

@CommandHandler(ApplyManualKycCommand)
export class ApplyManualKycHandler implements ICommandHandler<ApplyManualKycCommand> {
    constructor(
        @InjectDataSource()
        private readonly datasource: DataSource,
    ) {}

    async execute(command: ApplyManualKycCommand) {
        const { userId, id, notes } = command
        const manager = this.datasource.manager

        const kyc = await manager.findOne(UserKycEntity, { where: { id } })
        if (!kyc) {
            throw new NotFoundException('KYC record not found')
        }

        if (kyc.userId !== userId) {
            throw new ForbiddenException('You do not own this KYC record')
        }

        if (kyc.status === KycStatus.MANUAL_VERIFICATION_REQUESTED) {
            throw new BadRequestException('You have already requested manual verification')
        }

        kyc.status = KycStatus.MANUAL_VERIFICATION_REQUESTED
        kyc.notes = notes ? `Manual application: ${notes}` : 'Manual application requested'

        await manager.save(kyc)

        return {
            success: true,
            message: 'Manual verification requested',
        }
    }
}
