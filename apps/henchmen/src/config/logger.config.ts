import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export const loggerConfig = registerAs('logger.config', (): Params => {
    const shouldUsePretty = process.env['PINO_PRETTY'] === '1';

    return {
        pinoHttp: {
            ...(shouldUsePretty
                ? {
                      transport: {
                          target: 'pino-pretty',
                      },
                  }
                : {}),
        },
    };
});
