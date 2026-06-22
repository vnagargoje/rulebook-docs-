import { NotificationChannel } from '@yugo/shared'

export interface UpdateNotificationPayload {
    name?: string
    description?: string
    eventKey?: string
    channel?: NotificationChannel
    title?: string
    body?: string
    active?: boolean
}

export class UpdateNotificationCommand {
    constructor(
        public readonly notificationId: string,
        public readonly payload: UpdateNotificationPayload,
    ) {}
}
