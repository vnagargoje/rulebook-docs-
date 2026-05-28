import { z } from 'zod'

const topUpBaseSchema = z.object({
    name: z
        .string()
        .min(2, 'Plan name must be at least 2 characters')
        .max(100, 'Plan name must be at most 100 characters'),
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
    kmLimit: z.coerce
        .number({ message: 'Must be a number' })
        .min(0, 'Must be 0 or more'),
    price: z.coerce
        .number({ message: 'Must be a number' })
        .min(1, 'Price must be greater than 0'),
    gstPercentage: z.coerce
        .number({ message: 'Must be a number' })
        .min(0, 'Must be 0 or more')
        .max(100, 'Cannot exceed 100'),
    active: z.enum(['true', 'false'], { message: 'Status is required' }),
})

export const createTopUpPlanSchema = topUpBaseSchema
export const updateTopUpPlanSchema = topUpBaseSchema

export type CreateTopUpPlanFormValues = z.infer<typeof createTopUpPlanSchema>
export type CreateTopUpPlanFormInput = z.input<typeof createTopUpPlanSchema>
export type UpdateTopUpPlanFormValues = z.infer<typeof updateTopUpPlanSchema>
export type UpdateTopUpPlanFormInput = z.input<typeof updateTopUpPlanSchema>
