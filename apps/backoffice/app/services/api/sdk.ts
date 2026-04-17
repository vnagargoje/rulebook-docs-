import { Api } from './codegen/Api'
import { getAuthFromStorage, removeAuthFromStorage } from '~/lib/token'

const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4500'

export const api = new Api({
    baseURL: apiUrl,
})

// Add auth interceptor to the generated client's xior instance
api.instance.interceptors.request.use((config) => {
    const auth = getAuthFromStorage()
    if (auth?.accessToken) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${auth.accessToken}`,
        }
    }
    return config
})

api.instance.interceptors.response.use(
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

export const {
    v1AuthSignIn,
    v1AuthSendOtp,
    v1AuthVerifyOtp,
    v1CitiesListManyCities,
    v1StatesListManyStates,
} = api.v1
