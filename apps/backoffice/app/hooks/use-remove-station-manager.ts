import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { stationKeys } from '~/queries/stations'
import { useUpdateUser } from '~/queries/users/use-update-user'

export function useRemoveStationManager(stationId: string) {
    const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()
    const queryClient = useQueryClient()
    const [removingManagerId, setRemovingManagerId] = useState<string | null>(null)

    const removeManager = async () => {
        if (!removingManagerId) return
        
        const toastId = toast.loading('Removing manager...')
        try {
            await updateUser({
                id: removingManagerId,
                data: {
                    stationId: null as any,
                },
            })
            await queryClient.invalidateQueries({ queryKey: stationKeys.detail(stationId) })
            toast.success('Manager removed successfully', { id: toastId })
            setRemovingManagerId(null)
        } catch (error) {
            toast.error('Failed to remove manager', { id: toastId })
        }
    }

    return {
        removingManagerId,
        isRemoving: isUpdatingUser,
        promptRemove: setRemovingManagerId,
        cancelRemove: () => setRemovingManagerId(null),
        confirmRemove: removeManager,
    }
}
