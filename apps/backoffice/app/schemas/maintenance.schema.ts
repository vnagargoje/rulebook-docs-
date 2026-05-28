import { z } from 'zod'

const maintenanceBaseSchema = z.object({
    reportedDate: z
        .string()
        .min(1, 'Reported date is required')
        .refine((val) => !isNaN(new Date(val).getTime()), 'Enter a valid date')
        .refine((val) => new Date(val) <= new Date(), 'Reported date cannot be a future date'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    issueDescription: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be at most 1000 characters'),
    technicianName: z
        .string()
        .min(2, 'Technician name must be at least 2 characters')
        .max(100, 'Technician name must be at most 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
    expectedFixDate: z
        .string()
        .min(1, 'Expected fix date is required')
        .refine((val) => !isNaN(new Date(val).getTime()), 'Enter a valid date'),
    status: z.enum(['REPORTED', 'IN_PROGRESS', 'RESOLVED'], {
        message: 'Status is required',
    }),
})

export const createMaintenanceSchema = maintenanceBaseSchema
export const updateMaintenanceSchema = z.object({ id: z.string() }).merge(maintenanceBaseSchema)

export type CreateMaintenanceValues = z.infer<typeof createMaintenanceSchema>
export type UpdateMaintenanceValues = z.infer<typeof updateMaintenanceSchema>
