import { Type } from '@sinclair/typebox';
import { Gender, Roles } from '@yugo/shared';

export const UserResponse = Type.Object({
    id: Type.String(),
    email: Type.Optional(Type.String({ format: 'email' })),
    mobilenumber: Type.Optional(Type.String()),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    gender: Type.Optional(Type.Enum(Gender)),
    role: Type.Optional(Type.Enum(Roles)),
    properties: Type.Optional(Type.Any()),
    dateOfBirth: Type.Optional(Type.String({ format: 'date' })),
});
