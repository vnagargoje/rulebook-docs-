import { z } from 'zod'

const inactiveBaseSchema = z.object({
    reportedDate: z
        .string()
        .min(1, 'Reported date is required')
        .refine((val) => !isNaN(new Date(val).getTime()), 'Enter a valid date')
        .refine((val) => new Date(val) <= new Date(), 'Reported date cannot be a future date'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be at most 1000 characters'),
    status: z.enum(['REPORTED', 'UNDER_REVIEW', 'RESOLVED'], {
        message: 'Status is required',
    }),
})

export const createInactiveVehicleSchema = inactiveBaseSchema
export const updateInactiveVehicleSchema = z.object({ id: z.string() }).merge(inactiveBaseSchema)

export type CreateInactiveVehicleValues = z.infer<typeof createInactiveVehicleSchema>
export type UpdateInactiveVehicleValues = z.infer<typeof updateInactiveVehicleSchema>
