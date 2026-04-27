import { z } from 'zod'

export const createVehicleSchema = z.object({
    type: z.enum(['rental', 'transport']).optional(),
    vehicleNumber: z.string().min(1, 'Registration number is required'),
    rcNumber: z.string().optional(),
    chassisNumber: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    gpsId: z.string().optional(),
    insuranceExpiry: z.string().optional(),
    stationId: z.string().optional(),
})

export const updateVehicleSchema = z.object({
    type: z.enum(['rental', 'transport']).optional(),
    vehicleNumber: z.string().min(1, 'Registration number is required'),
    rcNumber: z.string().optional(),
    chassisNumber: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    gpsId: z.string().optional(),
    insuranceExpiry: z.string().optional(),
    stationId: z.string().optional(),
})

export type CreateVehicleFormValues = z.infer<typeof createVehicleSchema>
export type UpdateVehicleFormValues = z.infer<typeof updateVehicleSchema>
