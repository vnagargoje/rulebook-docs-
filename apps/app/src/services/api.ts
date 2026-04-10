import { getToken } from '@/lib/auth/utils'
import Env from '@env'
import { type XiorInterceptorRequestConfig } from 'xior'
import { Api } from './api/codegen/Api'

export const client = new Api({
    baseURL: Env.EXPO_PUBLIC_API_URL,
})

client.instance.interceptors.request.use(async (config: XiorInterceptorRequestConfig) => {
    try {
        const tokens = getToken()
        if (tokens?.access && !config.headers?.['Authorization']) {
            config.headers = config.headers || {}
            config.headers['Authorization'] = `Bearer ${tokens.access}`
        }
    } catch (err) {
        // Silently fail if storage is not ready or token missing
    }
    return config
})
