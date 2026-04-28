import { client } from '@/lib/api/client'
import type {
    V1BatterySwapsExecuteSwapBody,
    V1BatterySwapsExecuteSwapResponse,
    V1BatterySwapsVerifyInwardBatteryBody,
    V1BatterySwapsVerifyInwardBatteryResponse,
    V1UserPlansScanQrResponse,
} from '@/services/api/codegen/Api'
import { createMutation } from 'react-query-kit'

export const useScanUserPlan = createMutation<V1UserPlansScanQrResponse, { id: string }>({
    mutationKey: ['scan-user-plan'],
    mutationFn: async ({ id }) => {
        const response = await client.v1.v1UserPlansScanQr(id)
        return response.data
    },
})

export const useVerifyInwardBattery = createMutation<
    V1BatterySwapsVerifyInwardBatteryResponse,
    V1BatterySwapsVerifyInwardBatteryBody
>({
    mutationKey: ['verify-inward-battery'],
    mutationFn: async (body) => {
        const response = await client.v1.v1BatterySwapsVerifyInwardBattery(body)
        return response.data
    },
})

export const useExecuteSwap = createMutation<V1BatterySwapsExecuteSwapResponse, V1BatterySwapsExecuteSwapBody>({
    mutationKey: ['execute-swap'],
    mutationFn: async (body) => {
        const response = await client.v1.v1BatterySwapsExecuteSwap(body)
        return response.data
    },
})
