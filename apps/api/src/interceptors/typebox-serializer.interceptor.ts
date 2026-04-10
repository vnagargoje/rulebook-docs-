import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERIALIZE_SCHEMA_KEY } from '../decorators/serialize.decorator.js';

interface PaginatedResponse {
    data: unknown[];
    [key: string]: unknown;
}

@Injectable()
export class TypeboxSerializerInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const schema = this.reflector.getAllAndOverride<TSchema | undefined>(
            SERIALIZE_SCHEMA_KEY,
            [context.getHandler(), context.getClass()],
        );

        return next.handle().pipe(
            map((data: unknown) => {
                if (!schema) {
                    return data;
                }
                if (this.isPaginatedResponse(data)) {
                    return {
                        ...data,
                        data: data.data.map((item) =>
                            Value.Clean(schema, item as object),
                        ),
                    };
                }
                if (Array.isArray(data)) {
                    return data.map((item: unknown) =>
                        Value.Clean(schema, item as object),
                    );
                }
                return Value.Clean(schema, data as object);
            }),
        );
    }

    private isPaginatedResponse(data: unknown): data is PaginatedResponse {
        return (
            !!data &&
            typeof data === 'object' &&
            'data' in data &&
            Array.isArray((data as PaginatedResponse).data)
        );
    }
}
