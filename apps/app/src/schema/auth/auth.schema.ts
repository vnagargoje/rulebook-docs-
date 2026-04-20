import { z } from 'zod'

export const loginSchema = z.object({
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^[+]?\d[\d\s]{7,}$/, 'Enter a valid phone number'),
    acceptTerms: z.boolean().refine((value) => value === true, {
        message: 'You must accept the terms to continue',
    }),
    marketingOptIn: z.boolean().optional(),
})

export const otpSchema = z.object({
    code: z
        .string()
        .min(1, 'OTP code is required')
        .regex(/^\d{4}$/, 'Enter a 4-digit code'),
})
