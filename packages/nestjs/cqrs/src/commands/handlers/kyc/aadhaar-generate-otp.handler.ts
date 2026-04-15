import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { UserKycEntity } from '@yugo/nestjs-database/entities'
import { KycDocumentType, KycStatus } from '@yugo/shared'
import { EntityManager } from 'typeorm'
import xior from 'xior'
import { DeepvueConfig } from '../../../types.js'
import { AadhaarGenerateOtpCommand } from '../../impl/kyc/aadhaar-generate-otp.command.js'

@CommandHandler(AadhaarGenerateOtpCommand)
export class AadhaarGenerateOtpHandler implements ICommandHandler<AadhaarGenerateOtpCommand> {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: AadhaarGenerateOtpCommand) {
        const { userId, payload } = command
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')

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
            await this.manager.transaction(async (manager) => {
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
