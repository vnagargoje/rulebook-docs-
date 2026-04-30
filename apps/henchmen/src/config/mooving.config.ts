import { registerAs } from '@nestjs/config';

export const moovingConfig = registerAs('mooving.config', () => ({
    baseUrl: process.env['MOOVING_API_URL'],
    companyId: process.env['MOOVING_COMPANY_ID'],
    secretKey: process.env['MOOVING_SECRET_KEY'],
}));
