import { z } from 'zod'
import { nameField, mobileField, emailField, addressLineOneField, dobField } from './validations'

export const createUserSchema = z.object({
    firstName: nameField,
    lastName: nameField,
    mobilenumber: mobileField,
    email: emailField,
    gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
    dateOfBirth: dobField(18),
    role: z.enum(['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user'], {
        required_error: 'Role is required',
    }),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: addressLineOneField.optional().or(z.literal('')),
    lineTwo: z.string().max(100, 'Must be at most 100 characters').optional(),
    pincode: z.string().optional().refine(
        (val) => !val || /^[1-9]\d{5}$/.test(val),
        'Enter a valid 6-digit Indian PIN code',
    ),
}).superRefine((values, ctx) => {
    const hasAnyAddressField = Boolean(
        values.lineOne?.trim() ||
            values.lineTwo?.trim() ||
            values.pincode?.trim(),
    )

    if (!hasAnyAddressField) return

    if (!values.lineOne?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['lineOne'],
            message: 'Address Line 1 is required when address details are provided',
        })
    }

    if (!values.pincode?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['pincode'],
            message: 'PIN Code is required when address details are provided',
        })
    }
})

export const updateUserSchema = z.object({
    firstName: nameField,
    lastName: nameField,
    mobilenumber: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
    email: emailField.or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: dobField(18).or(z.literal('')),
    role: z.enum(['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user'], {
        required_error: 'Role is required',
    }),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: addressLineOneField.optional().or(z.literal('')),
    lineTwo: z.string().max(100, 'Must be at most 100 characters').optional(),
    pincode: z.string().optional().refine(
        (val) => !val || /^[1-9]\d{5}$/.test(val),
        'Enter a valid 6-digit Indian PIN code',
    ),
}).superRefine((values, ctx) => {
    const hasAnyAddressField = Boolean(
        values.lineOne?.trim() ||
            values.lineTwo?.trim() ||
            values.pincode?.trim(),
    )

    if (!hasAnyAddressField) return

    if (!values.lineOne?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['lineOne'],
            message: 'Address Line 1 is required when address details are provided',
        })
    }

    if (!values.pincode?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['pincode'],
            message: 'PIN Code is required when address details are provided',
        })
    }
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
