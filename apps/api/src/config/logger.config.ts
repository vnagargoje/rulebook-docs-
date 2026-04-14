import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { version } from '../../package.json';

export const loggerConfig = registerAs('logger.config', (): Params => {
    const params = {
        pinoHttp: {
            base: {
                pid: process.pid,
                serviceName: 'api',
                serviceVersion: version,
            },
            transport: {
                targets: [
                    {
                        level: 'trace',
                        target: 'pino-pretty',
                        options: {
                            all: true,
                            colorize: true,
                        },
                    },
                ],
            },
        },
    };

    return params;
});
