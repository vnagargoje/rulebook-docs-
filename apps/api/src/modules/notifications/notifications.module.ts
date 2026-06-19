import { Module } from '@nestjs/common';
import {
    GetNotificationHandler,
    GetNotificationsHandler,
    CreateNotificationHandler,
    UpdateNotificationHandler,
    DeleteNotificationHandler,
} from '@yugo/cqrs';
import { V1NotificationsController } from './controllers/v1/notifications.controller.js';

@Module({
    controllers: [V1NotificationsController],
    providers: [
        GetNotificationHandler,
        GetNotificationsHandler,
        CreateNotificationHandler,
        UpdateNotificationHandler,
        DeleteNotificationHandler,
    ],
})
export class NotificationsModule {}
