import { z } from 'zod'

export const createInactiveVehicleSchema = z.object({
    reportedDate: z.string().min(1, 'Reported date is required'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['REPORTED', 'UNDER_REVIEW', 'RESOLVED']),
})

export const updateInactiveVehicleSchema = z.object({
    id: z.string(),
    reportedDate: z.string().min(1, 'Reported date is required'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['REPORTED', 'UNDER_REVIEW', 'RESOLVED']),
})

export type CreateInactiveVehicleValues = z.infer<typeof createInactiveVehicleSchema>
export type UpdateInactiveVehicleValues = z.infer<typeof updateInactiveVehicleSchema>
