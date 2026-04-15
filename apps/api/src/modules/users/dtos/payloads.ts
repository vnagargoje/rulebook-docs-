import { Type } from '@sinclair/typebox';
import { Gender, Roles } from '@yugo/shared';

export const CreateUserPayload = Type.Object({
    email: Type.Optional(Type.String({ format: 'email' })),
    mobilenumber: Type.String(),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    gender: Type.Optional(Type.Enum(Gender)),
    role: Type.Optional(Type.Enum(Roles)),
    properties: Type.Optional(Type.Any()),
    dateOfBirth: Type.Optional(Type.String({ format: 'date' })),
});

export const UpdateUserPayload = Type.Partial(CreateUserPayload);
