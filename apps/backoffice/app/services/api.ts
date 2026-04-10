import { type XiorInterceptorRequestConfig } from 'xior'
import { getToken } from '~/lib/auth-utils'
import { Api } from './api/codegen/Api'

export const client = new Api({
    baseURL: (import.meta as any).env.VITE_API_URL ?? 'http://localhost:4500',
})

client.instance.interceptors.request.use(async (config: XiorInterceptorRequestConfig) => {
    try {
        const tokens = getToken()
        if (tokens?.access && !config.headers?.['Authorization']) {
            config.headers = config.headers || {}
            config.headers['Authorization'] = `Bearer ${tokens.access}`
        }
    } catch (err) {
        // Silently fail
    }
    return config
})
