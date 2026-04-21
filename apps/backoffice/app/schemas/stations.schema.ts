import { z } from 'zod'

export const createStationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['swap_station', 'hub_station']),
    active: z.enum(['true', 'false']),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    managerId: z.string().optional(),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: z.string().optional(),
    lineTwo: z.string().optional(),
    pincode: z.string().optional(),
})

export const updateStationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['swap_station', 'hub_station']),
    active: z.enum(['true', 'false']),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    managerId: z.string().optional(),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: z.string().optional(),
    lineTwo: z.string().optional(),
    pincode: z.string().optional(),
})

export type CreateStationFormValues = z.infer<typeof createStationSchema>
export type UpdateStationFormValues = z.infer<typeof updateStationSchema>
