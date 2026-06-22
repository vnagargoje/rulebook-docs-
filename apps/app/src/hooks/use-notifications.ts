import messaging from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import { toast } from 'sonner-native'

import { useAuthStore } from '@/stores/auth.store'
import { useRegisterDeviceToken } from '@/queries/device-token.query'

export function useNotifications() {
    const status = useAuthStore.use.status()
    const registerDeviceToken = useRegisterDeviceToken()

    useEffect(() => {
        if (status !== 'signIn') {
            return
        }

        let isMounted = true
        let unsubscribeTokenRefresh: (() => void) | undefined

        async function requestPermissionAndRegister() {
            try {
                let enabled = false
                if (Platform.OS === 'ios') {
                    const authStatus = await messaging().requestPermission()
                    enabled =
                        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL
                } else if (Platform.OS === 'android') {
                    if (Platform.Version >= 33) {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                        )
                        enabled = granted === PermissionsAndroid.RESULTS.GRANTED
                    } else {
                        enabled = true
                    }
                }

                if (!enabled || !isMounted) {
                    return
                }

                const fcmToken = await messaging().getToken()
                console.log('[useNotifications] FCM Token:', fcmToken)
                if (fcmToken && isMounted) {
                    registerDeviceToken.mutate({ data: { deviceToken: fcmToken } })
                }

                if (isMounted) {
                    unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
                        if (isMounted) {
                            registerDeviceToken.mutate({ data: { deviceToken: token } })
                        }
                    })
                }
            } catch (error) {
                console.error('Failed to get FCM token or register device token', error)
            }
        }

        void requestPermissionAndRegister()

        return () => {
            isMounted = false
            if (unsubscribeTokenRefresh) {
                unsubscribeTokenRefresh()
            }
        }
    }, [status])

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            if (remoteMessage.notification) {
                toast.info(remoteMessage.notification.title || 'Notification', {
                    description: remoteMessage.notification.body,
                })
            }
        })

        const unsubscribeOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('Notification caused app to open from background state:', remoteMessage.notification)
        })

        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from terminated state:', remoteMessage.notification)
                }
            })

        return () => {
            unsubscribe()
            unsubscribeOpenedApp()
        }
    }, [])
}
