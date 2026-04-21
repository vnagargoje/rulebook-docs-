import { z } from 'zod'

export const createSurrenderSchema = z.object({
    vehicleId: z.string().min(1, 'Vehicle is required'),
    customerId: z.string().min(1, 'Customer is required'),
    remarks: z.string().min(1, 'Remarks are required'),
    penaltyCharges: z.coerce.number().min(0, 'Must be >= 0'),
    depositReturnAmount: z.coerce.number().min(0, 'Must be >= 0'),
    status: z.enum(['SUBMITTED', 'APPROVED', 'CLOSED']),
})

export type CreateSurrenderValues = z.infer<typeof createSurrenderSchema>
