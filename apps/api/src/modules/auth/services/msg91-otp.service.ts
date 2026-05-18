import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
    OtpService,
    SendOtpParams,
    VerifyOtpParams,
    VerifyOtpResult,
} from './otp-service.interface.js';

@Injectable()
export class Msg91OtpService implements OtpService {
    private readonly baseUrl: string;

    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService,
        @InjectPinoLogger(Msg91OtpService.name)
        private readonly logger: PinoLogger,
    ) {
        const { baseUrl } = this.configService.getOrThrow('msg91-config');
        this.baseUrl = baseUrl;
    }

    async sendOtp(params: SendOtpParams): Promise<void> {
        const { mobilenumber } = params;
        const { authkey, otp_expiry, template_id } =
            this.configService.getOrThrow('msg91-config');

        try {
            const url = new URL('otp', this.baseUrl);
            url.searchParams.append('mobile', mobilenumber);
            url.searchParams.append('otp_expiry', otp_expiry.toString());
            url.searchParams.append('authkey', authkey);
            url.searchParams.append('template_id', template_id);

            const response = await fetch(url.toString(), {
                method: 'POST',
            });

            const data = await response.json();

            this.logger.info(
                {
                    event: 'otp:send',
                    mobilenumber,
                },
                'otp:send',
            );

            if (data.type === 'error') {
                this.logger.error(
                    {
                        event: 'otp:send',
                        mobilenumber,
                        error: data.message,
                    },
                    'otp:send',
                );
                throw new InternalServerErrorException(data.message);
            }
        } catch (error) {
            this.logger.error(
                {
                    event: 'otp:send',
                    mobilenumber,
                    error,
                },
                'otp:send',
            );
            if (error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Something went wrong while sending Otp',
            );
        }
    }

    async verifyOtp(params: VerifyOtpParams): Promise<VerifyOtpResult> {
        const { mobilenumber, code: otp } = params;
        const { authkey } = this.configService.getOrThrow('msg91-config');

        try {
            const url = new URL('otp/verify', this.baseUrl);
            url.searchParams.append('mobile', mobilenumber);
            url.searchParams.append('otp', otp);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    authkey: authkey,
                },
            });

            const data = await response.json();

            if (data.type === 'error') {
                this.logger.error(
                    {
                        event: 'otp:verify',
                        mobilenumber,
                        otp,
                        error: data.message,
                    },
                    'otp:verify',
                );
                return { status: 'failed' };
            } else {
                return { status: 'approved' };
            }
        } catch (error) {
            this.logger.error(
                {
                    event: 'otp:verify',
                    mobilenumber,
                    otp,
                    error,
                },
                'otp:verify',
            );
            return { status: 'failed' };
        }
    }

    async resendOtp(
        mobilenumber: string,
    ): Promise<{ type: string; message: string }> {
        const { authkey } = this.configService.getOrThrow('msg91-config');
        try {
            const url = new URL('otp/retry', this.baseUrl);
            url.searchParams.append('mobile', mobilenumber);
            url.searchParams.append('retrytype', 'text');
            url.searchParams.append('authkey', authkey);

            const response = await fetch(url.toString(), {
                method: 'GET',
            });

            const data = await response.json();

            if (data.type === 'error') {
                throw new InternalServerErrorException(data.message);
            } else {
                return data;
            }
        } catch (error) {
            this.logger.error(
                {
                    event: 'otp:retry',
                    mobilenumber,
                    error,
                },
                'otp:retry',
            );
            if (error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Something went wrong while resending Otp',
            );
        }
    }
}
