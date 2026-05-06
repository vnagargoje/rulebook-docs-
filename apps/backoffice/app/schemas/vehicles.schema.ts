import { z } from 'zod'
import { vehicleNumberField } from './validations'

const vehicleBaseSchema = z.object({
    type: z.enum(['rental', 'transport']).optional(),
    vehicleNumber: vehicleNumberField,
    rcNumber: z
        .string()
        .max(20, 'RC number must be at most 20 characters')
        .regex(/^[a-zA-Z0-9-]*$/, 'Only alphanumeric characters and hyphens allowed')
        .optional()
        .or(z.literal('')),
    chassisNumber: z
        .string()
        .max(17, 'Chassis number must be at most 17 characters')
        .regex(/^[a-zA-Z0-9]*$/, 'Only alphanumeric characters allowed')
        .optional()
        .or(z.literal('')),
    brand: z.string().max(50, 'Brand must be at most 50 characters').optional(),
    model: z.string().max(50, 'Model must be at most 50 characters').optional(),
    gpsId: z.string().max(50, 'GPS ID must be at most 50 characters').optional(),
    insuranceExpiry: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(new Date(val).getTime()),
            'Enter a valid insurance expiry date',
        )
        .refine(
            (val) => !val || new Date(val) >= new Date(new Date().toDateString()),
            'Insurance expiry cannot be in the past',
        ),
    stationId: z.string().optional(),
})

export const createVehicleSchema = vehicleBaseSchema
export const updateVehicleSchema = vehicleBaseSchema

export type CreateVehicleFormValues = z.infer<typeof createVehicleSchema>
export type UpdateVehicleFormValues = z.infer<typeof updateVehicleSchema>
