import { z } from 'zod'

export const createBatterySchema = z.object({
    batteryCode: z.string().min(1, 'Code is required'),
    gpsId: z.string().optional(),
    capacity: z.string().optional(),
    range: z.string().optional(),
    lifecycle: z.string().optional(),
    chargingTime: z.string().optional(),
    weight: z.string().optional(),
    mfgDate: z.string().optional(),
    warranty: z.string().optional(),
    removable: z.boolean(),
    stationId: z.string().optional(),
})

export const updateBatterySchema = z.object({
    batteryCode: z.string().min(1, 'Code is required'),
    gpsId: z.string().optional(),
    capacity: z.string().optional(),
    range: z.string().optional(),
    lifecycle: z.string().optional(),
    chargingTime: z.string().optional(),
    weight: z.string().optional(),
    mfgDate: z.string().optional(),
    warranty: z.string().optional(),
    removable: z.boolean(),
    stationId: z.string().optional(),
})

export const batteryAssignmentSchema = z.object({
    stationId: z.string().min(1, 'Station is required'),
    batteryIds: z.array(z.string()).min(1, 'At least one battery is required'),
})

export type CreateBatteryFormValues = z.infer<typeof createBatterySchema>
export type UpdateBatteryFormValues = z.infer<typeof updateBatterySchema>
export type BatteryAssignmentValues = z.infer<typeof batteryAssignmentSchema>
