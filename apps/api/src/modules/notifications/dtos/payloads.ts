import { Type } from '@sinclair/typebox'
import { NotificationChannel } from '@yugo/shared'

export const CreateNotificationPayload = Type.Object({
    name: Type.String(),
    description: Type.Optional(Type.String()),
    eventKey: Type.String(),
    channel: Type.Enum(NotificationChannel),
    title: Type.Optional(Type.String()),
    body: Type.String(),
    active: Type.Optional(Type.Boolean({ default: true })),
})

export const UpdateNotificationPayload = Type.Partial(CreateNotificationPayload)
