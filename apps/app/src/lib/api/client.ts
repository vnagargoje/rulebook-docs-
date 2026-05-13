import Env from '../../../env'
import { Api } from '@/services/api/codegen/Api'
import { getAuthToken } from '@/stores/auth.store'

const normalizedBaseUrl = Env.EXPO_PUBLIC_API_URL || 'https://api.evyugo.com'

export const client = new Api({
    baseURL: normalizedBaseUrl,
    securityWorker: () => {
        const authToken = getAuthToken()

        if (!authToken?.access) {
            return undefined
        }

        return {
            headers: {
                Authorization: `Bearer ${authToken.access}`,
            },
        }
    },
})
