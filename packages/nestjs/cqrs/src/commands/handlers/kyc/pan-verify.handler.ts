import { NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserEntity, UserKycEntity } from '@yugo/nestjs-database/entities'
import { KycDocumentType, KycStatus } from '@yugo/shared'
import { DeepvueConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import xior from 'xior'
import { PanVerifyCommand } from '../../impl/kyc/pan-verify.command.js'

@CommandHandler(PanVerifyCommand)
export class PanVerifyHandler implements ICommandHandler<PanVerifyCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: PanVerifyCommand) {
        const { userId, pan } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')

        const user = await manager.findOne(UserEntity, { where: { id: userId } })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const authParams = new URLSearchParams()
        authParams.append('client_id', config.clientId)
        authParams.append('client_secret', config.clientSecret)

        const authResponse = await xior.post(`${config.baseUrl}/authorize`, authParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        const token = authResponse.data.access_token

        const response = await xior.get(`${config.baseUrl}/verification/panbasic`, {
            params: {
                pan_number: pan,
                consent: 'Y',
                purpose: 'For KYC Purpose',
            },
            headers: {
                'x-api-key': config.apiKey,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const isSuccess = response.data.code === 200 || response.data.code === 201

        await manager.transaction(async (manager) => {
            let kyc = await manager.findOne(UserKycEntity, {
                where: { userId, type: KycDocumentType.PAN },
            })

            if (!kyc) {
                kyc = manager.create(UserKycEntity, {
                    userId,
                    type: KycDocumentType.PAN,
                })
            }

            kyc.documentId = pan
            kyc.status = isSuccess ? KycStatus.VERIFIED : KycStatus.REJECTED
            kyc.verifiedAt = isSuccess ? new Date() : kyc.verifiedAt
            kyc.notes = JSON.stringify(response.data)

            await manager.save(kyc)
        })

        return {
            success: isSuccess,
            message: response.data.message || (isSuccess ? 'PAN verification successful' : 'PAN verification failed'),
        }
    }
}
