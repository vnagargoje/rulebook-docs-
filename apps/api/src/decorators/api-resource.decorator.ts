import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TSchema } from '@sinclair/typebox';
import { ApiPaginationQuery, PaginateConfig } from 'nestjs-paginate';
import { PaginatedListResponse } from '../dtos/responses.js';
import { Serialize } from './serialize.decorator.js';

export function ApiResource<T>(dto: TSchema, config?: PaginateConfig<T>) {
    if (config) {
        return applyDecorators(
            Serialize(dto),
            ApiPaginationQuery(config),
            ApiOkResponse({
                schema: PaginatedListResponse(dto) as object,
            }),
        );
    }
    return applyDecorators(
        Serialize(dto),
        ApiOkResponse({
            schema: dto as object,
        }),
    );
}
