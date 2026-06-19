import { Type } from '@sinclair/typebox'
import { NotificationChannel } from '@yugo/shared'

export const NotificationResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    eventKey: Type.String(),
    channel: Type.Enum(NotificationChannel),
    title: Type.Union([Type.String(), Type.Null()]),
    body: Type.String(),
    active: Type.Boolean(),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
})

export const InngestEventResponse = Type.Object({
    eventKey: Type.String(),
    data: Type.Array(Type.String()),
    notificationActive: Type.Boolean(),
})
