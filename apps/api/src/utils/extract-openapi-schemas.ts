import type { OpenAPIObject } from '@nestjs/swagger';

export function extractInlineSchemas(document: OpenAPIObject): OpenAPIObject {
    const schemas: Record<string, object> = document.components?.schemas
        ? { ...document.components.schemas }
        : {};

    function toPascalCase(operationId: string): string {
        return operationId
            .split(/[_\-\s]+/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }

    function deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    const paths = document.paths ?? {};

    for (const [, pathItem] of Object.entries(paths)) {
        for (const method of [
            'get',
            'post',
            'put',
            'patch',
            'delete',
        ] as const) {
            const operation = (pathItem as any)?.[method];
            if (!operation?.operationId) continue;

            const baseName = toPascalCase(operation.operationId);

            if (operation.responses) {
                for (const [statusCode, response] of Object.entries(
                    operation.responses,
                )) {
                    const mediaType = (response as any)?.content?.[
                        'application/json'
                    ];
                    if (!mediaType?.schema) continue;

                    const schema = mediaType.schema;
                    if (
                        schema.$ref ||
                        (schema.type !== 'object' && schema.type !== 'array')
                    ) {
                        continue;
                    }

                    const schemaName =
                        statusCode === '200' || statusCode === '201'
                            ? `${baseName}Response`
                            : `${baseName}${statusCode}Response`;

                    if (!schemas[schemaName]) {
                        schemas[schemaName] = deepClone(schema);
                    }

                    mediaType.schema = {
                        $ref: `#/components/schemas/${schemaName}`,
                    };
                }
            }

            const reqMediaType =
                operation.requestBody?.content?.['application/json'];
            if (reqMediaType?.schema) {
                const schema = reqMediaType.schema;
                if (
                    !schema.$ref &&
                    (schema.type === 'object' || schema.type === 'array')
                ) {
                    const schemaName = `${baseName}Body`;

                    if (!schemas[schemaName]) {
                        schemas[schemaName] = deepClone(schema);
                    }

                    reqMediaType.schema = {
                        $ref: `#/components/schemas/${schemaName}`,
                    };
                }
            }
        }
    }

    document.components = document.components ?? {};
    document.components.schemas = schemas;

    return document;
}
