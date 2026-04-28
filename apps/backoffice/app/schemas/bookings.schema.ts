import { z } from 'zod'

export const assignVehicleSchema = z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    batteryId: z.string().min(1, 'Battery ID is required'),
    otp: z.string().regex(/^\d{4}$/, 'Pickup OTP must be exactly 4 digits'),
})

export type AssignVehicleValues = z.infer<typeof assignVehicleSchema>
