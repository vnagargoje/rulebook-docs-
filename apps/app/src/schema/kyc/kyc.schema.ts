import { z } from 'zod'

export const aadhaarFormSchema = z.object({
    aadhaarNumber: z.string().regex(/^\d{12}$/, 'Enter a valid 12-digit Aadhaar number'),
    captcha: z.string().min(1, 'Enter the captcha text'),
})

export const aadhaarOtpSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit OTP sent to your Aadhaar-linked number'),
})

export const panSchema = z.object({
    pan: z
        .string()
        .transform((v) => v.toUpperCase().trim())
        .pipe(z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN (e.g. ABCDE1234F)')),
})

export const licenseSchema = z.object({
    dlNumber: z
        .string()
        .transform((v) => v.toUpperCase().trim())
        .pipe(z.string().regex(/^[A-Z]{2}\d{13}$/, 'Enter a valid DL number (e.g. MH0123456789012)')),
    dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter date as DD-MM-YYYY')
        .trim(),
})

const singleAddressSchema = z.object({
    lineOne: z.string().min(5, 'Enter at least 5 characters').trim(),
    lineTwo: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
    stateId: z.string().min(1, 'Select a state'),
    cityId: z.string().min(1, 'Select a city'),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
})

// All fields optional with no base constraints — superRefine handles conditional validation
const currentAddressSchema = z.object({
    lineOne: z.string().optional(),
    lineTwo: z.string().optional(),
    pincode: z.string().optional(),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
})

export const addressSchema = z
    .object({
        permanent: singleAddressSchema,
        sameAsPermanent: z.boolean(),
        current: currentAddressSchema.optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.sameAsPermanent) {
            const current = data.current
            if (!current?.lineOne || current.lineOne.trim().length < 5) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Enter at least 5 characters',
                    path: ['current', 'lineOne'],
                })
            }
            if (!current?.pincode || !/^\d{6}$/.test(current.pincode)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Enter a valid 6-digit pincode',
                    path: ['current', 'pincode'],
                })
            }
            if (!current?.stateId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Select a state',
                    path: ['current', 'stateId'],
                })
            }
            if (!current?.cityId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Select a city',
                    path: ['current', 'cityId'],
                })
            }
        }
    })

export const emergencyContactSchema = z.object({
    contactName: z.string().min(2, 'Name is required').trim(),
    contactMobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
})

export type AadhaarFormValues = z.infer<typeof aadhaarFormSchema>
export type AadhaarOtpValues = z.infer<typeof aadhaarOtpSchema>
export type PanFormValues = z.infer<typeof panSchema>
export type LicenseFormValues = z.infer<typeof licenseSchema>
export type AddressFormValues = z.infer<typeof addressSchema>
export type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>
