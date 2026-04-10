import { SetMetadata } from '@nestjs/common';
import { TSchema } from '@sinclair/typebox';

export const SERIALIZE_SCHEMA_KEY = 'serializeSchema';
export const Serialize = (schema: TSchema) =>
    SetMetadata(SERIALIZE_SCHEMA_KEY, schema);
