import { z } from 'zod'

// ─── Common Regex ──────────────────────────────────────────────────────────────
/** Only letters and spaces, 2–50 chars, no leading/trailing whitespace */
export const NAME_REGEX = /^[a-zA-Z][a-zA-Z\s]{0,48}[a-zA-Z]$|^[a-zA-Z]{2}$/

/** Exactly 10 digits starting with 6–9 */
export const MOBILE_REGEX = /^[6-9]\d{9}$/

/** Exactly 6 digits, first digit non-zero (Indian PIN) */
export const PINCODE_REGEX = /^[1-9]\d{5}$/

/** Indian vehicle registration: e.g. MH01AB1234 or MH 01 AB 1234 */
export const VEHICLE_NUMBER_REGEX = /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,3}\s?\d{4}$/i

/** Alphanumeric only (for chassis, RC, battery codes) */
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/

/** Address line: alphanumeric + , . - / and spaces */
export const ADDRESS_LINE_REGEX = /^[a-zA-Z0-9\s,.\-/]+$/

/** Latitude: -90 to 90 decimal */
export const LATITUDE_REGEX = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/

/** Longitude: -180 to 180 decimal */
export const LONGITUDE_REGEX = /^-?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/

// ─── Reusable Field Validators ────────────────────────────────────────────────
export const nameField = z
    .string()
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Must be at most 50 characters')
    .regex(NAME_REGEX, 'Only letters and spaces allowed, no leading/trailing spaces')

export const mobileField = z
    .string()
    .regex(MOBILE_REGEX, 'Enter a valid 10-digit mobile number starting with 6–9')

export const emailField = z
    .string()
    .min(1, 'Email is required')
    .max(100, 'Email must be at most 100 characters')
    .email('Enter a valid email address (e.g. name@domain.com)')

export const pincodeField = z
    .string()
    .regex(PINCODE_REGEX, 'Enter a valid 6-digit Indian PIN code')

export const addressLineOneField = z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(100, 'Address must be at most 100 characters')
    .regex(ADDRESS_LINE_REGEX, 'Only letters, numbers and , . - / are allowed')

export const cityNameField = z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed')

export const vehicleNumberField = z
    .string()
    .min(1, 'Vehicle registration number is required')
    .regex(VEHICLE_NUMBER_REGEX, 'Enter a valid Indian vehicle number (e.g. MH01AB1234)')
    .transform((v) => v.toUpperCase())

/** Returns a date validator that ensures age >= minAge years (defaults to 18) */
export function dobField(minAge = 18) {
    return z
        .string()
        .min(1, 'Date of birth is required')
        .refine((val) => {
            const dob = new Date(val)
            return !isNaN(dob.getTime())
        }, 'Enter a valid date')
        .refine((val) => {
            return new Date(val) <= new Date()
        }, 'Date of birth cannot be a future date')
        .refine((val) => {
            const dob = new Date(val)
            const today = new Date()
            const age = today.getFullYear() - dob.getFullYear()
            const m = today.getMonth() - dob.getMonth()
            const adjustedAge = m < 0 || (m === 0 && today.getDate() < dob.getDate()) ? age - 1 : age
            return adjustedAge >= minAge
        }, `Minimum age is ${minAge} years`)
}

/** Returns a date validator ensuring the date is not in the past */
export function futureDateField(label = 'Date') {
    return z
        .string()
        .min(1, `${label} is required`)
        .refine((val) => {
            const d = new Date(val)
            return !isNaN(d.getTime())
        }, 'Enter a valid date')
        .refine((val) => {
            return new Date(val) >= new Date(new Date().toDateString())
        }, `${label} cannot be in the past`)
}

/** Returns a past/present date validator */
export function pastOrPresentDate(label = 'Date') {
    return z
        .string()
        .min(1, `${label} is required`)
        .refine((val) => {
            const d = new Date(val)
            return !isNaN(d.getTime())
        }, 'Enter a valid date')
        .refine((val) => {
            return new Date(val) <= new Date()
        }, `${label} cannot be a future date`)
}
