import { Type } from '@sinclair/typebox';
import { AddressType, Gender } from '@yugo/shared';

export const RoleResponse = Type.Object({
    name: Type.String(),
});

export const StateResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    code: Type.String(),
});

export const CityResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    state: Type.Optional(StateResponse),
});

export const AddressResponse = Type.Object({
    id: Type.String(),
    lineOne: Type.String(),
    lineTwo: Type.Optional(Type.String()),
    pincode: Type.String(),
    city: Type.Optional(CityResponse),
    type: Type.Optional(Type.Enum(AddressType)),
});

export const UserResponse = Type.Object({
    id: Type.String(),
    email: Type.Optional(Type.String({ format: 'email' })),
    mobilenumber: Type.Optional(Type.String()),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    gender: Type.Optional(Type.Enum(Gender)),
    properties: Type.Optional(Type.Any()),
    dateOfBirth: Type.Optional(Type.String({ format: 'date' })),
    roles: Type.Optional(Type.Array(RoleResponse)),
    addresses: Type.Optional(Type.Array(AddressResponse)),
    stationId: Type.Optional(Type.String()),
    station: Type.Optional(
        Type.Object({
            id: Type.String(),
            name: Type.String(),
        }),
    ),
    active: Type.Boolean(),
});
