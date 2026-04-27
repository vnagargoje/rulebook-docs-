/* eslint-disable react-refresh/only-export-components */
import { Dimensions, Platform } from 'react-native'
import { toast } from 'sonner-native'
import { isXiorError } from 'xior'

export const IS_IOS = Platform.OS === 'ios'
const { width, height } = Dimensions.get('screen')

export const WIDTH = width
export const HEIGHT = height

// for onError react queries and mutations
export function showError(error: unknown) {
    const backendMessage = isXiorError(error) ? extractError(error.response?.data) : extractError(error)
    const message = backendMessage.trim() || 'Something went wrong'

    if (isXiorError(error)) {
        console.log(JSON.stringify(error.response?.data))
    } else {
        console.log(error)
    }

    toast.error(message)
}

export function showErrorMessage(message: string = 'Something went wrong') {
    toast.error(message)
}

export function showSuccessMessage(message: string) {
    toast.success(message)
}

export function extractError(data: unknown): string {
    if (typeof data === 'string') {
        return data
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
        return String(data)
    }

    if (Array.isArray(data)) {
        return data
            .map((item) => extractError(item).trim())
            .filter(Boolean)
            .join('\n')
    }

    if (typeof data === 'object' && data !== null) {
        const record = data as Record<string, unknown>

        // Prefer backend-standard top-level message fields.
        if (record.message !== undefined) {
            return extractError(record.message)
        }

        if (record.error !== undefined) {
            return extractError(record.error)
        }

        if (record.details !== undefined) {
            return extractError(record.details)
        }

        if (record.errors !== undefined) {
            return extractError(record.errors)
        }

        // Fallback: flatten remaining object values.
        const messages = Object.values(record)
            .map((value) => extractError(value).trim())
            .filter(Boolean)

        return messages.join('\n')
    }

    return 'Something went wrong'
}
