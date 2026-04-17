import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string({
            message: 'Email is required',
        })
        .min(1, 'Email is required')
        .email('Invalid Email Format'),
    password: z
        .string({
            message: 'Password is required',
        })
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
})

export type LoginSchemaValues = z.infer<typeof loginSchema>
