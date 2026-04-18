import { z } from 'zod'

export const createPlanSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    validityDays: z.coerce.number().min(1, 'Must be at least 1 day'),
    kmLimit: z.coerce.number().min(0, 'Must be 0 or more'),
    price: z.coerce.number().min(0, 'Must be 0 or more'),
    deposit: z.coerce.number().min(0, 'Must be 0 or more'),
    gst: z.coerce.number().min(0, 'Must be 0 or more'),
    registrationFee: z.coerce.number().min(0, 'Must be 0 or more'),
    active: z.enum(['true', 'false']),
})

export const updatePlanSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    validityDays: z.coerce.number().min(1, 'Must be at least 1 day'),
    kmLimit: z.coerce.number().min(0, 'Must be 0 or more'),
    price: z.coerce.number().min(0, 'Must be 0 or more'),
    deposit: z.coerce.number().min(0, 'Must be 0 or more'),
    gst: z.coerce.number().min(0, 'Must be 0 or more'),
    registrationFee: z.coerce.number().min(0, 'Must be 0 or more'),
    active: z.enum(['true', 'false']),
})

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>
export type CreatePlanFormInput = z.input<typeof createPlanSchema>
export type UpdatePlanFormValues = z.infer<typeof updatePlanSchema>
export type UpdatePlanFormInput = z.input<typeof updatePlanSchema>
