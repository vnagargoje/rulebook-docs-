import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserKycEntity } from '@yugo/nestjs-database/entities'
import { KycDocumentType, KycStatus } from '@yugo/shared'
import { DeepvueConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import xior from 'xior'
import { AadhaarGenerateOtpCommand } from '../../impl/kyc/aadhaar-generate-otp.command.js'

@CommandHandler(AadhaarGenerateOtpCommand)
export class AadhaarGenerateOtpHandler implements ICommandHandler<AadhaarGenerateOtpCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: AadhaarGenerateOtpCommand) {
        const { userId, payload } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')

        await manager.transaction(async (manager) => {
            let kyc = await manager.findOne(UserKycEntity, {
                where: { userId, type: KycDocumentType.AADHAR },
            })

            if (!kyc) {
                kyc = manager.create(UserKycEntity, {
                    userId,
                    type: KycDocumentType.AADHAR,
                })
            }

            kyc.documentId = payload.aadhaarNumber
            kyc.status = KycStatus.PENDING
            kyc.notes = 'Initiated'

            await manager.save(kyc)
        })

        const response = await xior.post(
            `${config.baseUrl}/ekyc/aadhaar/generate-otp`,
            {}, // Empty body
            {
                params: {
                    session_id: payload.sessionId,
                    captcha: payload.captcha,
                    aadhaar_number: payload.aadhaarNumber,
                    consent: 'Y',
                    purpose: 'For KYC Purpose',
                },
                headers: {
                    'x-api-key': config.apiKey,
                    'client-id': config.clientId,
                    'Content-Type': 'application/json',
                },
            },
        )

        const isSuccess = response.data.code === 200 || response.data.code === 201

        if (isSuccess) {
            await manager.transaction(async (manager) => {
                let kyc = await manager.findOne(UserKycEntity, {
                    where: { userId, type: KycDocumentType.AADHAR },
                })

                if (!kyc) {
                    kyc = manager.create(UserKycEntity, {
                        userId,
                        type: KycDocumentType.AADHAR,
                    })
                }

                kyc.documentId = payload.aadhaarNumber
                kyc.status = KycStatus.PENDING
                kyc.notes = JSON.stringify(response.data)

                await manager.save(kyc)
            })
        }

        return {
            success: isSuccess,
            message: response.data.message || 'OTP generated successfully',
        }
    }
}
