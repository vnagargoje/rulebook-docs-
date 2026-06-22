import { Inject, Injectable, Logger } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { NESTJS_FCM_OPTIONS_TOKEN } from './configurable.module'
import type { NestjsFcmOptions } from './configurable.module'

@Injectable()
export class FcmService {
    private readonly logger = new Logger(FcmService.name)
    private fcmApp: admin.app.App

    constructor(
        @Inject(NESTJS_FCM_OPTIONS_TOKEN)
        options: NestjsFcmOptions,
    ) {
        const appName = 'yugo-fcm'
        const existingApp = admin.apps.find((app) => app?.name === appName)

        if (existingApp) {
            this.fcmApp = existingApp
        } else {
            let credential: admin.ServiceAccount | undefined

            if (options.serviceAccountJson) {
                try {
                    credential = JSON.parse(options.serviceAccountJson)
                } catch (error) {
                    this.logger.error('Failed to parse serviceAccountJson', error)
                }
            } else if (options.projectId && options.clientEmail && options.privateKey) {
                credential = {
                    projectId: options.projectId,
                    clientEmail: options.clientEmail,
                    privateKey: options.privateKey.replace(/\\n/g, '\n'),
                }
            }

            this.fcmApp = admin.initializeApp(
                {
                    credential: credential ? admin.credential.cert(credential) : admin.credential.applicationDefault(),
                },
                appName,
            )
        }
    }

    async send(message: admin.messaging.Message): Promise<string> {
        try {
            const response = await this.fcmApp.messaging().send(message)
            this.logger.debug(`Successfully sent message: ${response}`)
            return response
        } catch (error) {
            this.logger.error('Error sending single push notification', error)
            throw error
        }
    }

    async sendMulticast(message: admin.messaging.MulticastMessage): Promise<admin.messaging.BatchResponse> {
        try {
            const response = await this.fcmApp.messaging().sendEachForMulticast(message)
            this.logger.debug(
                `Successfully sent multicast message. Success count: ${response.successCount}, Failure count: ${response.failureCount}`,
            )
            return response
        } catch (error) {
            this.logger.error('Error sending multicast push notification', error)
            throw error
        }
    }
}
