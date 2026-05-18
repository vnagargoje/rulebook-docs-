import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserKycEntity } from '@yugo/nestjs-database/entities'
import { KycDocumentType, KycStatus, MAX_KYC_ATTEMPTS } from '@yugo/shared'
import { BadRequestException } from '@nestjs/common'
import { DeepvueConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import xior from 'xior'
import { LicenseInitiateCommand } from '../../impl/kyc/license-initiate.command.js'

@CommandHandler(LicenseInitiateCommand)
export class LicenseInitiateHandler implements ICommandHandler<LicenseInitiateCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: LicenseInitiateCommand) {
        const { userId, payload } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')

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

            if ((kyc.attemptCount ?? 0) >= MAX_KYC_ATTEMPTS) {
                throw new BadRequestException('Driving licence verification attempt limit reached')
            }

            kyc.documentId = payload.dlNumber
            kyc.status = KycStatus.PENDING
            kyc.notes = 'Initiated'
            kyc.attemptCount = (kyc.attemptCount ?? 0) + 1

            await manager.save(kyc)
        })

        const authParams = new URLSearchParams()
        authParams.append('client_id', config.clientId)
        authParams.append('client_secret', config.clientSecret)

        const authResponse = await xior.post(`${config.baseUrl}/authorize`, authParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        const token = authResponse.data.access_token

        const response = await xior.post(
            `${config.baseUrl}/verification/post-driving-license`,
            {}, // empty body
            {
                params: {
                    dl_number: payload.dlNumber,
                    dob: payload.dob,
                },
                headers: {
                    'x-api-key': config.apiKey,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        )

        return {
            requestId: response.data.request_id,
        }
    }
}
