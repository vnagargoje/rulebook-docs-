import { z } from 'zod'
import { addressLineOneField } from './validations'

const stationBaseSchema = z.object({
    name: z
        .string()
        .min(2, 'Station name must be at least 2 characters')
        .max(100, 'Station name must be at most 100 characters'),
    type: z.enum(['swap_station', 'hub_station', 'vehicle_station'], { message: 'Station type is required' }),
    active: z.enum(['true', 'false'], { message: 'Status is required' }),
    latitude: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(val),
            'Enter a valid latitude (-90 to 90)',
        ),
    longitude: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^-?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/.test(val),
            'Enter a valid longitude (-180 to 180)',
        ),
    managerId: z.string().optional(),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: addressLineOneField.optional().or(z.literal('')),
    lineTwo: z.string().max(100).optional(),
    pincode: z
        .string()
        .optional()
        .refine((val) => !val || /^[1-9]\d{5}$/.test(val), 'Enter a valid 6-digit Indian PIN code'),
})

export const createStationSchema = stationBaseSchema
export const updateStationSchema = stationBaseSchema

export type CreateStationFormValues = z.infer<typeof createStationSchema>
export type UpdateStationFormValues = z.infer<typeof updateStationSchema>
