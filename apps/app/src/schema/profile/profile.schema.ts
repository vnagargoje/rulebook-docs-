import { z } from 'zod'

import { PROFILE_GENDERS } from '@/constants/profile.constants'

export const profileSchema = z.object({
    firstName: z.string().trim().min(2, 'Min 2 characters'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    gender: z.enum(PROFILE_GENDERS).or(z.literal('')),
    dateOfBirth: z.string().or(z.literal('')),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
