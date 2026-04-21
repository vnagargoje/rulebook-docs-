import { NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserEntity, UserKycEntity } from '@yugo/nestjs-database/entities'
import { KycDocumentType, KycStatus } from '@yugo/shared'
import { DeepvueConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import xior from 'xior'
import { LicenseGetResultCommand } from '../../impl/kyc/license-get-result.command.js'

@CommandHandler(LicenseGetResultCommand)
export class LicenseGetResultHandler implements ICommandHandler<LicenseGetResultCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: LicenseGetResultCommand) {
        const { userId, requestId } = command
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

        const response = await xior.get(`${config.baseUrl}/verification/get-driving-license`, {
            params: {
                request_id: requestId,
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

        if (isSuccess) {
            await manager.transaction(async (manager) => {
                let kyc = await manager.findOne(UserKycEntity, {
                    where: { userId, type: KycDocumentType.DRIVING_LICENSE },
                })

                if (!kyc) {
                    kyc = manager.create(UserKycEntity, {
                        userId,
                        type: KycDocumentType.DRIVING_LICENSE,
                    })
                }

                kyc.documentId = response.data.data?.dl_number || kyc.documentId || 'LICENSE'
                kyc.status = KycStatus.VERIFIED
                kyc.verifiedAt = new Date()
                kyc.notes = JSON.stringify(response.data)

                await manager.save(kyc)
            })
        }

        return {
            success: isSuccess,
            message:
                response.data.message ||
                (isSuccess ? 'License verification successful' : 'License verification failed'),
        }
    }
}
