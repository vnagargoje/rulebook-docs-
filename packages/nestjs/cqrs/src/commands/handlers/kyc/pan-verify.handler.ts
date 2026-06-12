import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserEntity, UserKycEntity } from '@yugo/nestjs-database/entities'
import { KycDocumentType, KycStatus, MAX_KYC_ATTEMPTS } from '@yugo/shared'
import { DeepvueConfig } from 'src/types/index.js'
import { DataSource } from 'typeorm'
import xior from 'xior'
import { PanVerifyCommand } from '../../impl/kyc/pan-verify.command.js'
import { namesMatch } from 'src/utils/kyc-name-match.js'

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

            if ((kyc.attemptCount ?? 0) >= MAX_KYC_ATTEMPTS) {
                throw new BadRequestException('PAN verification attempt limit reached')
            }

            const panDuplicate = await manager.findOne(UserKycEntity, {
                where: { documentId: pan, type: KycDocumentType.PAN, status: KycStatus.VERIFIED },
            })
            if (panDuplicate && panDuplicate.userId !== userId) {
                throw new ConflictException('This PAN number is already registered with another account')
            }

            kyc.documentId = pan
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

        const panStatus = response.data.code === 200 ? response.data.data.status : null

        const isSuccess = panStatus === 'VALID' ? true : false

        let nameMismatchError = false

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

            if (isSuccess) {
                const panName: string =
                    response.data?.data?.full_name ||
                    response.data?.data?.name_information?.pan_name_cleaned ||
                    response.data?.result?.name ||
                    response.data?.data?.name ||
                    ''
                kyc.verifiedName = panName || null

                if (panName) {
                    const otherVerified = await manager.find(UserKycEntity, {
                        where: { userId, status: KycStatus.VERIFIED },
                    })
                    for (const other of otherVerified) {
                        if (other.verifiedName && !namesMatch(panName, other.verifiedName)) {
                            nameMismatchError = true
                            break
                        }
                    }
                }
            }

            if (nameMismatchError) {
                kyc.status = KycStatus.REJECTED
                kyc.notes = 'Aadhaar and PAN card names do not match'
            } else {
                kyc.status = isSuccess ? KycStatus.VERIFIED : KycStatus.REJECTED
                kyc.verifiedAt = isSuccess ? new Date() : kyc.verifiedAt
                kyc.notes = JSON.stringify(response.data)
            }

            await manager.save(kyc)
        })

        if (nameMismatchError) {
            throw new BadRequestException('Aadhaar and PAN card names do not match')
        }

        return {
            success: isSuccess,
            message: response.data.message || (isSuccess ? 'PAN verification successful' : 'PAN verification failed'),
            data: response.data,
        }
    }
}
