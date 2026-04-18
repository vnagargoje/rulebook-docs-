import { z } from 'zod'

export const customerAssignmentSchema = z.object({
    vehicleId: z.string().min(1, 'Vehicle is required'),
    customerId: z.string().min(1, 'Customer is required'),
})

export type CustomerAssignmentValues = z.infer<typeof customerAssignmentSchema>

export const stationAssignmentSchema = z.object({
    vehicleId: z.string().min(1, 'Vehicle is required'),
    vehicleNumber: z.string().min(1, 'Vehicle number is required'),
    stationId: z.string().min(1, 'Station is required'),
})

export type StationAssignmentValues = z.infer<typeof stationAssignmentSchema>
