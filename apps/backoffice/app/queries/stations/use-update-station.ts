import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1StationsUpdateOneStationBody } from '~/services/api/codegen/Api'
import { v1StationsUpdateOneStation } from '~/services/api/sdk'
import { stationKeys } from './keys'

export type UpdateStationPayload = V1StationsUpdateOneStationBody

export function useUpdateStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateStationPayload }) => {
            const response = await v1StationsUpdateOneStation(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: stationKeys.all })
            queryClient.invalidateQueries({ queryKey: stationKeys.detail(variables.id) })
        },
    })
}
