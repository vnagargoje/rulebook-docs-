import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConfigService } from '@nestjs/config'
import xior from 'xior'
import { LicenseInitiateCommand } from '../../impl/kyc/license-initiate.command.js'
import { DeepvueConfig } from '../../../types.js'

@CommandHandler(LicenseInitiateCommand)
export class LicenseInitiateHandler implements ICommandHandler<LicenseInitiateCommand> {
    constructor(private readonly configService: ConfigService) {}

    async execute(command: LicenseInitiateCommand) {
        const { payload } = command
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')

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
            {
                dl_number: payload.dlNumber,
                dob: payload.dob,
            },
            {
                params: {
                    consent: 'Y',
                    purpose: 'For KYC Purpose',
                },
                headers: {
                    'x-api-key': config.apiKey,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        )

        return {
            requestId: response.data.data.request_id,
        }
    }
}
