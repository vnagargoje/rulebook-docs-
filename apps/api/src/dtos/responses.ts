import { TSchema, Type } from '@sinclair/typebox';

export const PaginatedListResponse = (data: TSchema) =>
    Type.Object({
        data: Type.Array(data),
        meta: Type.Object({
            itemsPerPage: Type.Number(),
            totalItems: Type.Number(),
            currentPage: Type.Number(),
            totalPages: Type.Number(),
            sortBy: Type.Array(
                Type.Tuple([
                    Type.String(),
                    Type.Union([Type.Literal('ASC'), Type.Literal('DESC')]),
                ]),
            ),
            searchBy: Type.Array(Type.String()),
            search: Type.String(),
            filter: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
        }),
        links: Type.Object({
            first: Type.Optional(Type.String()),
            last: Type.Optional(Type.String()),
            current: Type.String(),
            previous: Type.Optional(Type.String()),
            next: Type.Optional(Type.String()),
        }),
    });
