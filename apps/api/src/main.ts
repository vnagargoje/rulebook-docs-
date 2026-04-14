import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { apiReference } from '@scalar/nestjs-api-reference';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { updateGlobalConfig } from 'nestjs-paginate';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { queryMiddleware } from './utils/query-middleware.js';
import { setupSwagger } from './utils/setup_swagger.js';

updateGlobalConfig({
    defaultLimit: 20,
    defaultMaxLimit: 1000,
});

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });
    const logger = app.get<Logger>(Logger);
    app.useLogger(logger);
    const configService = app.get<ConfigService>(ConfigService);

    app.enableCors();
    app.enableShutdownHooks();

    app.set('trust proxy', true);
    app.set('query parser', queryMiddleware());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                directives: {
                    'script-src': ["'self'"],
                    'style-src': ["'self'"],
                },
            },
        }),
    );

    app.enableVersioning({
        type: VersioningType.URI,
    });

    await setupSwagger(app);
    app.use(
        '/reference',
        apiReference({
            url: '/openapi.json',
            _integration: 'nestjs',
        }),
    );

    const HOST = '0.0.0.0';
    const PORT = parseInt(configService.get<string>('PORT', '4500'), 10);

    await app.listen(PORT, HOST, () => {
        console.log(`Application started listening at http://${HOST}:${PORT}`);
    });
}
bootstrap();
