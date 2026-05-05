import { type XiorInterceptorRequestConfig } from 'xior'
import { getToken } from '~/lib/auth-utils'
import { Api } from './api/codegen/Api'

export const client = new Api({
    baseURL: 'https://api.evyugo.com',
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
