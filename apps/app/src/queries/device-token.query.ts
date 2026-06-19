import { createMutation } from 'react-query-kit'

import { showError } from '@/components/ui'
import { client } from '@/lib/api/client'
import type { V1UsersRegisterDeviceTokenBody } from '@/services/api/codegen/Api'

export const useRegisterDeviceToken = createMutation<void, { data: V1UsersRegisterDeviceTokenBody }>({
    mutationKey: ['register-device-token'],
    mutationFn: async ({ data }) => {
        const response = await client.v1.v1UsersRegisterDeviceToken(data)
        return response.data
    },
    onError: (error) => {
        showError(error)
    },
})
