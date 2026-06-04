import { z } from 'zod'

const batteryBaseSchema = z.object({
    batteryCode: z
        .string()
        .min(1, 'Battery QR/code is required')
        .max(50, 'Battery code must be at most 50 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Only alphanumeric characters, hyphens and underscores allowed'),
    gpsId: z
        .string()
        .max(50, 'GPS ID must be at most 50 characters')
        .optional()
        .or(z.literal('')),
    capacity: z
        .string()
        .optional()
        .refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
            'Capacity must be a positive number',
        ),
    range: z
        .string()
        .optional()
        .refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
            'Range must be a positive number',
        ),
    lifecycle: z
        .string()
        .optional()
        .refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
            'Lifecycle must be a positive number',
        ),
    chargingTime: z
        .string()
        .optional()
        .refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
            'Charging time must be a positive number',
        ),
    weight: z
        .string()
        .optional()
        .refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
            'Weight must be a positive number',
        ),
    mfgDate: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(new Date(val).getTime()),
            'Enter a valid manufacture date',
        )
        .refine(
            (val) => !val || new Date(val) <= new Date(),
            'Manufacture date cannot be in the future',
        ),
    warranty: z.string().max(50, 'Warranty must be at most 50 characters').optional(),
    removable: z.boolean(),
    stationId: z.string().optional(),
})

export const createBatterySchema = batteryBaseSchema
export const updateBatterySchema = batteryBaseSchema

export const batteryAssignmentSchema = z.object({
    stationId: z.string().min(1, 'Station is required'),
    status: z.string().min(1, 'Please select battery status'),
    batteryIds: z.array(z.string()).min(1, 'At least one battery is required'),
})

export type CreateBatteryFormValues = z.infer<typeof createBatterySchema>
export type UpdateBatteryFormValues = z.infer<typeof updateBatterySchema>
export type BatteryAssignmentValues = z.infer<typeof batteryAssignmentSchema>
