import { Type } from '@sinclair/typebox';
import { Gender, Roles } from '@yugo/shared';

export const AddressPayload = Type.Object({
    lineOne: Type.String(),
    lineTwo: Type.Optional(Type.String()),
    pincode: Type.String(),
    cityId: Type.Optional(Type.String()),
});

export const CreateUserPayload = Type.Object({
    email: Type.Optional(Type.String({ format: 'email' })),
    mobilenumber: Type.String(),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    gender: Type.Optional(Type.Enum(Gender)),
    role: Type.Optional(Type.Enum(Roles)),
    properties: Type.Optional(Type.Any()),
    dateOfBirth: Type.Optional(Type.String({ format: 'date' })),
    address: Type.Optional(AddressPayload),
});

export const UpdateUserPayload = Type.Partial(CreateUserPayload);

export const UpdateUserAddressesPayload = Type.Object({
    current: Type.Optional(AddressPayload),
    permanent: Type.Optional(AddressPayload),
});
