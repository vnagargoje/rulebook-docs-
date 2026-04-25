import { z } from 'zod'

export const createSurrenderSchema = z.object({
    vehicleNumber: z.string().min(1, 'Vehicle number is required'),
    penalty: z.coerce.number().min(0, 'Must be >= 0'),
    miscCharges: z.coerce.number().min(0, 'Must be >= 0'),
    refundAmount: z.coerce.number().min(0, 'Must be >= 0'),
    notes: z.string().optional(),
})

export type CreateSurrenderValues = z.infer<typeof createSurrenderSchema>
