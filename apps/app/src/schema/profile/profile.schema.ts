import { z } from 'zod'

import { PROFILE_GENDERS } from '@/constants/profile.constants'

export const profileSchema = z.object({
    firstName: z.string().trim().min(2, 'Min 2 characters').regex(/^[A-Za-z\s]+$/, 'Only alphabets are allowed'),
    lastName: z.string().trim().min(1, 'Last name is required').regex(/^[A-Za-z\s]+$/, 'Only alphabets are allowed'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    gender: z.enum(PROFILE_GENDERS).or(z.literal('')),
    dateOfBirth: z.string().or(z.literal('')).superRefine((val, ctx) => {
        if (!val) return;
        const dobDate = new Date(val);
        
        if (isNaN(dobDate.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Enter a valid date.",
            });
            return;
        }

        const today = new Date();
        
        if (dobDate > today) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Date of Birth cannot be a future date.",
            });
            return;
        }

        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }

        if (age < 18) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "User must be at least 18 years old.",
            });
        }
    }),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
