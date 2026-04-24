import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1StationsCreateOneStationBody } from '~/services/api/codegen/Api'
import { v1StationsCreateOneStation } from '~/services/api/sdk'
import { stationKeys } from './keys'

export type CreateStationPayload = V1StationsCreateOneStationBody

export function useCreateStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateStationPayload) => {
            const response = await v1StationsCreateOneStation(data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: stationKeys.all })
        },
    })
}
