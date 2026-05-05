import xior from 'xior'
import { getAuthFromStorage, removeAuthFromStorage } from './token'

const apiClient = xior.create({
    baseURL: (import.meta.env.VITE_API_URL as string) || 'https://api.evyugo.com',
})

apiClient.interceptors.request.use((config) => {
    const auth = getAuthFromStorage()
    if (auth?.accessToken) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${auth.accessToken}`,
        }
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeAuthFromStorage()
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default apiClient
