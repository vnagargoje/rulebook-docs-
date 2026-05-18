export const userRoleOptions = ['HUB_MANAGER', 'SWAP_STATION_MANAGER', 'CUSTOMER'] as const
export const genderOptions = ['MALE', 'FEMALE', 'OTHER'] as const
export const stationTypeOptions = ['HUB', 'SWAP_STATION', 'CHARGING_STATION'] as const
export const activeStatusOptions = ['ACTIVE', 'INACTIVE'] as const
export const vehicleStatusOptions = [
    'AVAILABLE',
    'ASSIGNED_TO_STATION',
    'ASSIGNED_TO_CUSTOMER',
    'IN_MAINTENANCE',
    'INACTIVE',
] as const
export const maintenanceStatusOptions = ['REPORTED', 'IN_PROGRESS', 'RESOLVED'] as const
export const inactiveVehicleStatusOptions = ['REPORTED', 'UNDER_REVIEW', 'RESOLVED'] as const
export const assignmentStatusOptions = ['PENDING', 'ASSIGNED', 'REASSIGNED', 'COMPLETED'] as const
export const batteryStatusOptions = ['AVAILABLE', 'IN_USE', 'IN_TRANSIT', 'NEEDS_CHARGE'] as const
export const surrenderStatusOptions = ['SUBMITTED', 'APPROVED', 'CLOSED'] as const

export type UserRole = (typeof userRoleOptions)[number]
export type Gender = (typeof genderOptions)[number]
export type StationType = (typeof stationTypeOptions)[number]
export type ActiveStatus = (typeof activeStatusOptions)[number]
export type VehicleStatus = (typeof vehicleStatusOptions)[number]
export type MaintenanceStatus = (typeof maintenanceStatusOptions)[number]
export type InactiveVehicleStatus = (typeof inactiveVehicleStatusOptions)[number]
export type AssignmentStatus = (typeof assignmentStatusOptions)[number]
export type BatteryStatus = (typeof batteryStatusOptions)[number]
export type SurrenderStatus = (typeof surrenderStatusOptions)[number]

export type ResourceId = string

/** planSnapshot is `any` in codegen – narrow for safe access */
export interface PlanSnapshot {
    name?: string
    price?: number
    deposit?: number
    gstPercentage?: number
    registrationFee?: number
    totalAmount?: number
    validityDays?: number
    kmLimit?: number
}

/** topUpSnapshot is `any` in codegen – narrow for safe access */
export interface TopUpSnapshot {
    name?: string
    description?: string
    validityDays?: number
    kmLimit?: number
    price?: number
    gstPercentage?: number
    totalAmount?: number
}

export interface Address {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
}

export interface AdminAccount {
    id: ResourceId
    name: string
    email: string
    password: string
    role: 'SYSTEM_ADMIN'
}

export interface AdminSession {
    adminId: ResourceId
    name: string
    email: string
    role: 'SYSTEM_ADMIN'
}

export interface User {
    id: ResourceId
    name: string
    mobile: string
    email: string
    gender: Gender
    dob: string
    role: UserRole
    stationId?: ResourceId
    address: Address
    status: ActiveStatus
}

export interface Station {
    id: ResourceId
    name: string
    code: string
    type: StationType
    address: Address
    latitude: string
    longitude: string
    status: ActiveStatus
}

export interface Plan {
    id: ResourceId
    name: string
    description: string
    validityDays: number
    kmRange: number
    price: number
    deposit: number
    status: ActiveStatus
}

export interface Vehicle {
    id: ResourceId
    registrationNumber: string
    rcNumber: string
    chassisNumber: string
    brand: string
    model: string
    gpsId: string
    insuranceExpiry: string
    status: VehicleStatus
    stationId?: ResourceId
    customerId?: ResourceId
}

export interface MaintenanceRecord {
    id: ResourceId
    reportedDate: string
    vehicleId: ResourceId
    issueDescription: string
    technicianName: string
    expectedFixDate: string
    status: MaintenanceStatus
}

export interface InactiveVehicleRecord {
    id: ResourceId
    reportedDate: string
    vehicleId: ResourceId
    description: string
    status: InactiveVehicleStatus
}

export interface VehicleStationAssignment {
    id: ResourceId
    vehicleId: ResourceId
    stationId: ResourceId
    assignedAt: string
    status: AssignmentStatus
}

export interface CustomerVehicleRequest {
    id: ResourceId
    customerId: ResourceId
    requestedAt: string
    preferredStationId: ResourceId
    notes: string
    status: AssignmentStatus
}

export interface CustomerVehicleAssignment {
    id: ResourceId
    vehicleId: ResourceId
    customerId: ResourceId
    assignedAt: string
    status: AssignmentStatus
}

export interface Battery {
    id: ResourceId
    batteryCode: string
    manufacturedAt: string
    gpsId: string
    capacityAh: number
    rangeKm: number
    lifecycleCount: number
    chargingTimeHours: number
    weightKg: number
    warrantyUntil: string
    removable: boolean
    status: BatteryStatus
    stationId?: ResourceId
}

export interface BatteryStationAssignment {
    id: ResourceId
    stationId: ResourceId
    batteryIds: ResourceId[]
    assignedAt: string
    status: AssignmentStatus
}

export interface VehicleSurrender {
    id: ResourceId
    vehicleId: ResourceId
    customerId: ResourceId
    remarks: string
    penaltyCharges: number
    depositReturnAmount: number
    submittedAt: string
    status: SurrenderStatus
}

export interface DashboardSummary {
    activeUsers: number
    activeStations: number
    activePlans: number
    availableVehicles: number
    availableBatteries: number
    pendingRequests: number
}

export interface Database {
    admins: AdminAccount[]
    users: User[]
    stations: Station[]
    plans: Plan[]
    topUpPlans: Plan[]
    vehicles: Vehicle[]
    maintenance: MaintenanceRecord[]
    inactiveVehicles: InactiveVehicleRecord[]
    vehicleStationAssignments: VehicleStationAssignment[]
    customerRequests: CustomerVehicleRequest[]
    customerVehicleAssignments: CustomerVehicleAssignment[]
    batteries: Battery[]
    batteryStationAssignments: BatteryStationAssignment[]
    surrenders: VehicleSurrender[]
}
