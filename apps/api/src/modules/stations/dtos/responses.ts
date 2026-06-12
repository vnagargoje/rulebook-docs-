import { Type } from '@sinclair/typebox';
import { StationType } from '@yugo/shared';

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
});

export const StationManagerResponse = Type.Object({
    id: Type.String(),
    email: Type.Optional(Type.String({ format: 'email' })),
    mobilenumber: Type.Optional(Type.String()),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
});

export const StationResponse = Type.Object({
    id: Type.String(),
    type: Type.Enum(StationType),
    name: Type.String(),
    longitude: Type.Optional(Type.Number({ precision: 11, scale: 8 })),
    latitude: Type.Optional(Type.Number({ precision: 10, scale: 8 })),
    active: Type.Boolean(),
    address: Type.Optional(AddressResponse),
    managers: Type.Optional(Type.Array(StationManagerResponse)),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
});

export const NearestSwapStationResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    latitude: Type.Optional(Type.Number()),
    longitude: Type.Optional(Type.Number()),
    active: Type.Boolean(),
    distanceKm: Type.Number(),
    address: Type.Optional(AddressResponse),
});
