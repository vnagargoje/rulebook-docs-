import { Type } from '@sinclair/typebox';

export const StateResponse = Type.Object({
    id: Type.String(),
    code: Type.String(),
    name: Type.String(),
    latitude: Type.Number(),
    longitude: Type.Number(),
});

export const CityResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    latitude: Type.Number(),
    longitude: Type.Number(),
});
