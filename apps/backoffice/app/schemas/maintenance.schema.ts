import { z } from 'zod'

export const createMaintenanceSchema = z.object({
    reportedDate: z.string().min(1, 'Reported date is required'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    issueDescription: z.string().min(1, 'Description is required'),
    technicianName: z.string().min(1, 'Technician name is required'),
    expectedFixDate: z.string().min(1, 'Expected fix date is required'),
    status: z.enum(['REPORTED', 'IN_PROGRESS', 'RESOLVED']),
})

export const updateMaintenanceSchema = z.object({
    id: z.string(),
    reportedDate: z.string().min(1, 'Reported date is required'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    issueDescription: z.string().min(1, 'Description is required'),
    technicianName: z.string().min(1, 'Technician name is required'),
    expectedFixDate: z.string().min(1, 'Expected fix date is required'),
    status: z.enum(['REPORTED', 'IN_PROGRESS', 'RESOLVED']),
})

export type CreateMaintenanceValues = z.infer<typeof createMaintenanceSchema>
export type UpdateMaintenanceValues = z.infer<typeof updateMaintenanceSchema>
