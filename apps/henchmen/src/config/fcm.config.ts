import { registerAs } from '@nestjs/config';
import { NestjsFcmOptions } from '@yugo/nestjs-fcm';

export const fcmConfig = registerAs('fcm.config', (): NestjsFcmOptions => {
    const env = process.env;
    return {
        projectId: env['FIREBASE_PROJECT_ID'],
        clientEmail: env['FIREBASE_CLIENT_EMAIL'],
        privateKey: env['FIREBASE_PRIVATE_KEY'],
        serviceAccountJson: env['FIREBASE_SERVICE_ACCOUNT_JSON'],
    };
});
