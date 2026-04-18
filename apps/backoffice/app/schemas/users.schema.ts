import { z } from 'zod'

export const createUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    mobilenumber: z.string().min(10, 'Mobile number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    role: z.enum(['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user']),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: z.string().optional(),
    lineTwo: z.string().optional(),
    pincode: z.string().optional(),
})

export const updateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    mobilenumber: z.string().min(10, 'Mobile number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    role: z.enum(['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user']),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: z.string().optional(),
    lineTwo: z.string().optional(),
    pincode: z.string().optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
