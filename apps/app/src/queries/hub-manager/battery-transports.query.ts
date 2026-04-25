import { client } from '@/lib/api/client'
import type {
    V1BatteryTransportsDispatchBatteriesBody,
    V1BatteryTransportsDispatchBatteriesResponse,
    V1BatteryTransportsReceiveBatteriesBody,
    V1BatteryTransportsReceiveBatteriesResponse,
    V1BatteryTransportsUpdateBatteryStatusBody,
    V1BatteryTransportsUpdateBatteryStatusResponse,
} from '@/services/api/codegen/Api'
import { createMutation } from 'react-query-kit'

export const useDispatchBatteries = createMutation<
    V1BatteryTransportsDispatchBatteriesResponse,
    V1BatteryTransportsDispatchBatteriesBody
>({
    mutationKey: ['dispatch-batteries'],
    mutationFn: async (body) => {
        const response = await client.v1.v1BatteryTransportsDispatchBatteries(body)
        return response.data
    },
})

export const useReceiveBatteries = createMutation<
    V1BatteryTransportsReceiveBatteriesResponse,
    { movementId: string } & V1BatteryTransportsReceiveBatteriesBody
>({
    mutationKey: ['receive-batteries'],
    mutationFn: async ({ movementId, ...body }) => {
        const response = await client.v1.v1BatteryTransportsReceiveBatteries(movementId, body)
        return response.data
    },
})

export const useUpdateBatteryStatus = createMutation<
    V1BatteryTransportsUpdateBatteryStatusResponse,
    { batteryQrId: string } & V1BatteryTransportsUpdateBatteryStatusBody
>({
    mutationKey: ['update-battery-status'],
    mutationFn: async ({ batteryQrId, ...body }) => {
        const response = await client.v1.v1BatteryTransportsUpdateBatteryStatus(batteryQrId, body)
        return response.data
    },
})
