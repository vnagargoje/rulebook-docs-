import { registerAs } from '@nestjs/config';

export const deepvueConfig = registerAs('deepvue.config', () => ({
    clientId: process.env.DEEPVUE_CLIENT_ID,
    clientSecret: process.env.DEEPVUE_CLIENT_SECRET,
    apiKey: process.env.DEEPVUE_API_KEY,
    baseUrl: process.env.DEEPVUE_BASE_URL || 'https://production.deepvue.tech/v1',
}));
