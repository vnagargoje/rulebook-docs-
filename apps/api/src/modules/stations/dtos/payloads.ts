import { Type } from '@sinclair/typebox';
import { StationType } from '@yugo/shared';

export const NearestSwapStationsPayload = Type.Object({
    latitude: Type.Number({ minimum: -90, maximum: 90 }),
    longitude: Type.Number({ minimum: -180, maximum: 180 }),
});

export const AddressPayload = Type.Object({
    lineOne: Type.String(),
    lineTwo: Type.Optional(Type.String()),
    pincode: Type.String(),
    cityId: Type.Optional(Type.String()),
});

export const CreateStationPayload = Type.Object({
    type: Type.Enum(StationType),
    name: Type.String(),
    longitude: Type.Optional(Type.Number({ precision: 11, scale: 8 })),
    latitude: Type.Optional(Type.Number({ precision: 10, scale: 8 })),
    active: Type.Boolean({ default: true }),
    address: Type.Optional(AddressPayload),
    managerId: Type.Optional(Type.String()),
});

export const UpdateStationPayload = Type.Partial(CreateStationPayload);
