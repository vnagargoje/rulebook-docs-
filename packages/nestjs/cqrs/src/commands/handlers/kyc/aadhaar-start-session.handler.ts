import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import xior from 'xior'
import { DeepvueConfig } from '../../../types.js'
import { AadhaarStartSessionCommand } from '../../impl/kyc/aadhaar-start-session.command.js'

@CommandHandler(AadhaarStartSessionCommand)
export class AadhaarStartSessionHandler implements ICommandHandler<AadhaarStartSessionCommand> {
    constructor(private readonly configService: ConfigService) {}

    async execute() {
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')
        const response = await xior.get(`${config.baseUrl}/ekyc/aadhaar/connect`, {
            params: {
                consent: 'Y',
                purpose: 'For KYC Purpose',
            },
            headers: {
                'x-api-key': config.apiKey,
                'client-id': config.clientId,
                'Content-Type': 'application/json',
            },
        })

        return {
            sessionId: response.data.data.session_id,
            captcha: response.data.data.captcha,
        }
    }
}
