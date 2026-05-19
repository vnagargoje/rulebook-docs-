import { ConflictException, NotFoundException } from '@nestjs/common'
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
            },
            headers: {
                'x-api-key': config.apiKey,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const result = Array.isArray(response.data) ? response.data[0] : response.data
        const sourceOutput = result?.result?.source_output
        const isCompleted = result?.status === 'completed'
        const isSuccess = isCompleted && sourceOutput?.status === 'id_found'

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

                const finalDocId = sourceOutput?.id_number || kyc.documentId
                if (finalDocId) {
                    const duplicate = await manager.findOne(UserKycEntity, {
                        where: { documentId: finalDocId, type: KycDocumentType.DRIVING_LICENSE, status: KycStatus.VERIFIED },
                    })
                    if (duplicate && duplicate.userId !== userId) {
                        throw new ConflictException('This driving licence number is already registered with another account')
                    }
                }

                kyc.documentId = sourceOutput?.id_number || kyc.documentId || 'LICENSE'
                kyc.status = KycStatus.VERIFIED
                kyc.verifiedAt = new Date()
                kyc.notes = JSON.stringify(result)

                await manager.save(kyc)
            })
        }

        return {
            success: isSuccess,
            message: isSuccess
                ? 'License verification successful'
                : `License verification failed: ${sourceOutput?.status ?? result?.status ?? 'unknown'}`,
        }
    }
}
