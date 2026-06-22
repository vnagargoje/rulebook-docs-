import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { NestjsInngestFunction } from '@yugo/nestjs-inngest';
import { type Context } from 'inngest';
import { EntityManager } from 'typeorm';
import { FcmService } from '@yugo/nestjs-fcm';
import { NotificationChannel, NotificationDeliveryStatus } from '@yugo/shared';
import {
    NotificationEntity,
    NotificationDeliveryEntity,
    UserEntity,
} from '@yugo/nestjs-database/entities';
import Handlebars from 'handlebars';

@Injectable()
export class NotificationServiceFunctions {
    private readonly logger = new Logger(NotificationServiceFunctions.name);

    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly fcmService: FcmService,
    ) {}

    @NestjsInngestFunction<any>({ id: 'handleNotificationEvents' }, [
        { event: 'plan/*' },
        { event: 'auth/*' },
        { event: 'user/*' },
        { event: 'booking/*' },
    ])
    async handleNotificationEvents({ event }: Context) {
        const eventKey = event.name;
        this.logger.log(`Received Inngest event: ${eventKey}`);

        // 1. Fetch active notification configurations for this event
        const templates = await this.entityManager.find(NotificationEntity, {
            where: {
                eventKey,
                active: true,
            },
        });

        if (templates.length === 0) {
            this.logger.log(
                `No active notification configurations found for eventKey: ${eventKey}. Skipping.`,
            );
            return null;
        }

        this.logger.log(
            `Found ${templates.length} active notification template(s) for eventKey: ${eventKey}`,
        );

        // 2. Extract userId from the event payload data
        const userId = event.data?.userId;
        if (!userId) {
            this.logger.warn(
                `Could not resolve userId from event data for eventKey: ${eventKey}`,
            );
            return null;
        }

        // 3. Retrieve user to get their deviceToken
        const user = await this.entityManager.findOne(UserEntity, {
            where: { id: userId },
        });

        const deviceToken = user?.properties?.deviceToken;
        if (!deviceToken) {
            this.logger.warn(`No deviceToken found for user: ${userId}`);
            return null;
        }

        // 4. Build and send notifications for each matching template
        for (const template of templates) {
            try {
                // Compile template using Handlebars directly with event.data as context
                const compiledTitle = template.title
                    ? Handlebars.compile(template.title)(event.data)
                    : undefined;
                const compiledBody = Handlebars.compile(template.body)(
                    event.data,
                );

                if (template.channel === NotificationChannel.PUSH) {
                    this.logger.log(
                        `Sending push notification to user ${userId}`,
                    );

                    let status: NotificationDeliveryStatus =
                        NotificationDeliveryStatus.SENT;
                    let messageContent = '';

                    try {
                        const messageId = await this.fcmService.send({
                            token: deviceToken,
                            notification: {
                                title: compiledTitle ?? 'Notification',
                                body: compiledBody,
                            },
                        });
                        this.logger.log(
                            `Notification sent successfully, messageId: ${messageId}`,
                        );
                        messageContent = `Notification sent successfully with ID: ${messageId}`;
                    } catch (err: any) {
                        this.logger.error(
                            `Failed to send push notification`,
                            err,
                        );
                        status = NotificationDeliveryStatus.FAILED;
                        messageContent = err.message || 'Unknown FCM error';
                    }

                    // Create delivery record
                    const delivery = this.entityManager.create(
                        NotificationDeliveryEntity,
                        {
                            eventId: event.id,
                            status,
                            title: compiledTitle ?? null,
                            body: compiledBody,
                            message: messageContent,
                            notification: template,
                        },
                    );
                    await this.entityManager.save(
                        NotificationDeliveryEntity,
                        delivery,
                    );
                }
            } catch (err) {
                this.logger.error(
                    `Error processing notification template ${template.id}`,
                    err,
                );
            }
        }

        return null;
    }
}
