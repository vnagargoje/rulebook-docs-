import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { pascalCase, snakeCase } from 'change-case';
import { extractInlineSchemas } from './extract-openapi-schemas.js';

export const setupSwagger = async (app: INestApplication) => {
    const env = process.env;
    const builder = new DocumentBuilder();

    builder
        .setTitle('Yugo Api')
        .setDescription('Yugo REST Api.')
        .setVersion('1.0')
        .addBearerAuth();

    if (env['SWAGGER_SERVER_URL']) {
        builder.addServer(env['SWAGGER_SERVER_URL']);
    }

    const options = builder.build();

    const document = extractInlineSchemas(
        SwaggerModule.createDocument(app, options, {
            operationIdFactory: (controllerKey, methodKey) => {
                return `${snakeCase(controllerKey.replace('Controller', ''))}${pascalCase(methodKey)}`;
            },
        }),
    );
    SwaggerModule.setup('openapi', app, document, {
        jsonDocumentUrl: 'openapi.json',
        yamlDocumentUrl: 'openapi.yaml',
        explorer: process.env.NODE_ENV !== 'production',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
        },
    });
};
