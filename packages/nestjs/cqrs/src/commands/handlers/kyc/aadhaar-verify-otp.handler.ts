import { ConflictException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { AddressEntity, UserEntity, UserKycEntity } from '@yugo/nestjs-database/entities'
import { Gender, KycDocumentType, KycStatus } from '@yugo/shared'
import { DeepvueConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import xior from 'xior'
import { AadhaarVerifyOtpCommand } from '../../impl/kyc/aadhaar-verify-otp.command.js'

@CommandHandler(AadhaarVerifyOtpCommand)
export class AadhaarVerifyOtpHandler implements ICommandHandler<AadhaarVerifyOtpCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(command: AadhaarVerifyOtpCommand) {
        const { userId, payload } = command
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')

        const user = await manager.findOne(UserEntity, { where: { id: userId }, relations: ['addresses'] })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const response = await xior.post(
            `${config.baseUrl}/ekyc/aadhaar/verify-otp`,
            {}, // Empty body
            {
                params: {
                    session_id: payload.sessionId,
                    otp: payload.otp,
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

            kyc.status = isSuccess ? KycStatus.VERIFIED : KycStatus.REJECTED
            kyc.verifiedAt = isSuccess ? new Date() : kyc.verifiedAt
            kyc.notes = JSON.stringify(response.data)
            kyc.documentId = payload.aadhaarNumber || kyc.documentId || 'AADHAAR'

            if (isSuccess && payload.aadhaarNumber) {
                const duplicate = await manager.findOne(UserKycEntity, {
                    where: { documentId: payload.aadhaarNumber, type: KycDocumentType.AADHAR, status: KycStatus.VERIFIED },
                })
                if (duplicate && duplicate.userId !== userId) {
                    throw new ConflictException('This Aadhaar number is already registered with another account')
                }
            }

            await manager.save(kyc)

            if (isSuccess && response.data.data) {
                const data = response.data.data

                const nameParts = (data.name || '').split(' ')
                const lastName = nameParts.pop() || ''
                const firstName = nameParts.join(' ') || lastName

                user.firstName = firstName
                user.lastName = lastName

                if (data.dateOfBirth) {
                    const [day, month, year] = data.dateOfBirth.split('-')
                    user.dateOfBirth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                }

                if (data.gender === 'M') {
                    user.gender = Gender.MALE
                } else if (data.gender === 'F') {
                    user.gender = Gender.FEMALE
                } else {
                    user.gender = Gender.OTHER
                }

                await manager.save(user)
            }
        })

        return {
            success: isSuccess,
            message: response.data.message || (isSuccess ? 'Verification successful' : 'Verification failed'),
        }
    }
}
