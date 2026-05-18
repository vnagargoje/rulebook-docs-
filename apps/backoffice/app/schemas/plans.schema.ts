import { z } from 'zod'

const planBaseSchema = z.object({
    name: z
        .string()
        .min(2, 'Plan name must be at least 2 characters')
        .max(100, 'Plan name must be at most 100 characters'),
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
    validityDays: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .int('Must be a whole number')
        .min(1, 'Must be at least 1 day')
        .max(3650, 'Cannot exceed 10 years (3650 days)'),
    kmLimit: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Must be 0 or more'),
    price: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(1, 'Price must be greater than 0'),
    deposit: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Must be 0 or more'),
    gstPercentage: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Must be 0 or more')
        .max(100, 'Cannot exceed 100'),
       
    registrationFee: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Must be 0 or more'),
    active: z.enum(['true', 'false'], { required_error: 'Status is required' }),
})

export const createPlanSchema = planBaseSchema
export const updatePlanSchema = planBaseSchema

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>
export type CreatePlanFormInput = z.input<typeof createPlanSchema>
export type UpdatePlanFormValues = z.infer<typeof updatePlanSchema>
export type UpdatePlanFormInput = z.input<typeof updatePlanSchema>
