import { z } from 'zod'
import { nameField, mobileField, emailField, addressLineOneField, dobField } from './validations'

export const createUserSchema = z.object({
    firstName: nameField,
    lastName: nameField,
    mobilenumber: mobileField,
    email: emailField,
    gender: z.enum(['male', 'female', 'other'], { message: 'Gender is required' }),
    dateOfBirth: dobField(18),
    role: z.enum(['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user']).optional(),
    active: z.enum(['true', 'false'], { message: 'Status is required' }),
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
    role: z.enum(['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user']).optional(),
    active: z.enum(['true', 'false'], { message: 'Status is required' }),
    // Current address
    currentStateId: z.string().optional(),
    currentCityId: z.string().optional(),
    currentLineOne: addressLineOneField.optional().or(z.literal('')),
    currentLineTwo: z.string().max(100).optional(),
    currentPincode: z.string().optional().refine(
        (val) => !val || /^[1-9]\d{5}$/.test(val),
        'Enter a valid 6-digit Indian PIN code',
    ),
    // Permanent address
    sameAddress: z.boolean().optional(),
    permanentStateId: z.string().optional(),
    permanentCityId: z.string().optional(),
    permanentLineOne: addressLineOneField.optional().or(z.literal('')),
    permanentLineTwo: z.string().max(100).optional(),
    permanentPincode: z.string().optional().refine(
        (val) => !val || /^[1-9]\d{5}$/.test(val),
        'Enter a valid 6-digit Indian PIN code',
    ),
}).superRefine((values, ctx) => {
    const hasCurrentAddress = Boolean(
        values.currentLineOne?.trim() || values.currentPincode?.trim(),
    )

    if (hasCurrentAddress) {
        if (!values.currentLineOne?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['currentLineOne'], message: 'Address Line 1 is required' })
        }
        if (!values.currentPincode?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['currentPincode'], message: 'PIN Code is required' })
        }
    }

    if (!values.sameAddress) {
        const hasPermanentAddress = Boolean(
            values.permanentLineOne?.trim() || values.permanentPincode?.trim(),
        )
        if (hasPermanentAddress) {
            if (!values.permanentLineOne?.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['permanentLineOne'], message: 'Address Line 1 is required' })
            }
            if (!values.permanentPincode?.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['permanentPincode'], message: 'PIN Code is required' })
            }
        }
    }
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
