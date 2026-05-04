import { registerAs } from '@nestjs/config';
import { NestJsInngestOptions } from '@yugo/nestjs-inngest';

export const inngestConfig = registerAs(
    'inngest.config',
    (): NestJsInngestOptions => {
        const env = process.env;
        return {
            clientOptions: {
                id: env['INNGEST_APP_ID']!,
                env: env['INNGEST_ENV'],
                baseUrl: env['INNGEST_BASE_URL'] ?? 'http://localhost:8288',
                eventKey: env['INNGEST_EVENT_KEY'],
                isDev: env['INNGEST_DEV'] !== '0',
            },
        };
    },
);
