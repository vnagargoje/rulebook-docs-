import { registerAs } from '@nestjs/config';

export const msg91Config = registerAs('msg91-config', () => {
    const env = process.env;
    return {
        baseUrl: env['MSG91_API_URL'] ?? 'https://control.msg91.com/api/v5/',
        authkey: env['MSG91_AUTH_KEY'],
        template_id: env['MSG91_OTP_TEMPLATE_ID'],
        otp_expiry: 2,
    };
});
