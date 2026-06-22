import { NotificationChannel } from '@yugo/shared'

export interface CreateNotificationPayload {
    name: string
    description?: string
    eventKey: string
    channel: NotificationChannel
    title?: string
    body: string
    active?: boolean
}

export class CreateNotificationCommand {
    constructor(public readonly payload: CreateNotificationPayload) {}
}
