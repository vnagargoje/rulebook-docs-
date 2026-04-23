import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeepvueConfig } from 'src/types/index.js'
import xior from 'xior'
import { AadhaarReloadCaptchaCommand } from '../../impl/kyc/aadhaar-reload-captcha.command.js'

@CommandHandler(AadhaarReloadCaptchaCommand)
export class AadhaarReloadCaptchaHandler implements ICommandHandler<AadhaarReloadCaptchaCommand> {
    constructor(private readonly configService: ConfigService) {}

    async execute(command: AadhaarReloadCaptchaCommand) {
        const { sessionId } = command
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')
        const response = await xior.get(`${config.baseUrl}/ekyc/aadhaar/reload-captcha`, {
            params: {
                session_id: sessionId,
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
            captcha: response.data.data.captcha,
        }
    }
}
