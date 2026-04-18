import { z } from 'zod'

export const createTopUpPlanSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    validityDays: z.coerce.number().min(1, 'Must be at least 1 day'),
    kmLimit: z.coerce.number().min(0, 'Must be 0 or more'),
    price: z.coerce.number().min(0, 'Must be 0 or more'),
    gst: z.coerce.number().min(0, 'Must be 0 or more'),
    active: z.enum(['true', 'false']),
})

export const updateTopUpPlanSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    validityDays: z.coerce.number().min(1, 'Must be at least 1 day'),
    kmLimit: z.coerce.number().min(0, 'Must be 0 or more'),
    price: z.coerce.number().min(0, 'Must be 0 or more'),
    gst: z.coerce.number().min(0, 'Must be 0 or more'),
    active: z.enum(['true', 'false']),
})

export type CreateTopUpPlanFormValues = z.infer<typeof createTopUpPlanSchema>
export type CreateTopUpPlanFormInput = z.input<typeof createTopUpPlanSchema>
export type UpdateTopUpPlanFormValues = z.infer<typeof updateTopUpPlanSchema>
export type UpdateTopUpPlanFormInput = z.input<typeof updateTopUpPlanSchema>
