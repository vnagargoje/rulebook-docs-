import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('Henchmen');
    const app = await NestFactory.create(AppModule);

    const port = process.env.PORT ?? 3001; // Different port than API
    await app.listen(port);

    logger.log(`Henchmen service is running on: http://localhost:${port}`);
}
bootstrap();
