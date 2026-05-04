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
    dlNumber: z.string().min(5, 'Enter a valid DL number').trim(),
    dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter date as YYYY-MM-DD')
        .trim(),
})

export const addressSchema = z.object({
    lineOne: z.string().min(5, 'Enter at least 5 characters').trim(),
    pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
    stateId: z.string().min(1, 'Select a state'),
    cityId: z.string().min(1, 'Select a city'),
    stateName: z.string().optional(),
    cityName: z.string().optional(),
})

export const emergencyContactSchema = z.object({
    contactName: z.string().min(2, 'Name is required').trim(),
    contactMobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
})

export type AadhaarFormValues = z.infer<typeof aadhaarFormSchema>
export type AadhaarOtpValues = z.infer<typeof aadhaarOtpSchema>
export type PanFormValues = z.infer<typeof panSchema>
export type LicenseFormValues = z.infer<typeof licenseSchema>
export type AddressFormValues = z.infer<typeof addressSchema>
export type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>
