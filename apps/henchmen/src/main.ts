import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { HenchmenModule } from './henchmen.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        HenchmenModule,
        { bufferLogs: true },
    );
    const configService = app.get<ConfigService>(ConfigService);
    const logger = app.get<Logger>(Logger);
    app.useLogger(logger);

    const HOST = configService.get<string>('HOST', '0.0.0.0');
    const PORT = +configService.get<string>('PORT', '4502');

    await app.listen(PORT, HOST, () => {
        logger.log(`Henchmen started listening at http://${HOST}:${PORT}`);
    });
}
bootstrap();
