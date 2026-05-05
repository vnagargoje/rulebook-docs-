import { z } from 'zod'
import { vehicleNumberField } from './validations'

export const createSurrenderSchema = z.object({
    vehicleNumber: vehicleNumberField,
    penalty: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Penalty must be 0 or more'),
    miscCharges: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Misc charges must be 0 or more'),
    refundAmount: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Refund amount must be 0 or more'),
    notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
})

export type CreateSurrenderValues = z.infer<typeof createSurrenderSchema>
