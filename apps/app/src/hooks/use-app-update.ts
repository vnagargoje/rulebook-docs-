import { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { toast } from 'sonner-native'

let ExpoUpdates: typeof import('expo-updates') | null = null
try {
    ExpoUpdates = require('expo-updates')
} catch {
    // native module ExpoUpdates not registered
}

export function useAppUpdate() {
    const [isChecking, setIsChecking] = useState(false)

    const checkForUpdate = useCallback(async () => {
        if (!ExpoUpdates?.isEnabled) {
            toast.info('Not Available', {
                description: 'OTA updates are only available in production or custom dev builds.',
            })
            return
        }

        setIsChecking(true)
        try {
            const result = await ExpoUpdates.checkForUpdateAsync()
            if (result.isAvailable) {
                toast.loading('Downloading update…', { id: 'ota-update' })
                await ExpoUpdates.fetchUpdateAsync()
                toast.dismiss('ota-update')
                Alert.alert(
                    'Update Ready',
                    'A new version has been downloaded. Restart now to apply it.',
                    [
                        { text: 'Later', style: 'cancel' },
                        { text: 'Restart Now', onPress: () => ExpoUpdates!.reloadAsync() },
                    ],
                )
            } else {
                toast.success('Up to Date', {
                    description: 'You are already on the latest version.',
                })
            }
        } catch {
            toast.error('Update Failed', {
                description: 'Could not check for updates. Please try again later.',
            })
        } finally {
            setIsChecking(false)
        }
    }, [])

    return { checkForUpdate, isChecking }
}
