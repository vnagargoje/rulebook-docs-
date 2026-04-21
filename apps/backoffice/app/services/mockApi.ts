import initialData from './data.json'

import type {
    AdminSession,
    Battery,
    BatteryStationAssignment,
    DashboardSummary,
    Database,
    InactiveVehicleRecord,
    MaintenanceRecord,
    Plan,
    Station,
    User,
    Vehicle,
    VehicleSurrender,
    VehicleStationAssignment,
    CustomerVehicleAssignment,
    CustomerVehicleRequest,
} from '~/types/admin'

const STORAGE_KEY = 'yugo_backoffice_db'
const SESSION_KEY = 'yugo_backoffice_session'

const fallbackDb = initialData as Database

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const createId = (prefix: string) => {
    const random = Math.random().toString(36).slice(2, 8)
    return `${prefix}-${random}`
}

class MockApi {
    private readDatabase() {
        if (typeof window === 'undefined') {
            return clone(fallbackDb)
        }

        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            const seed = clone(fallbackDb)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
            return seed
        }

        return JSON.parse(stored) as Database
    }

    private writeDatabase(database: Database) {
        if (typeof window === 'undefined') {
            return
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
    }

    private updateDatabase(mutator: (database: Database) => void) {
        const database = this.readDatabase()
        mutator(database)
        this.writeDatabase(database)
        return database
    }

    private saveCollection<T extends { id: string }>(
        database: Database,
        key: keyof Database,
        payload: T,
        prefix: string,
    ) {
        const collection = database[key] as T[]
        const index = collection.findIndex((item) => item.id === payload.id)

        if (index >= 0) {
            collection[index] = payload
            return payload
        }

        const nextItem = { ...payload, id: payload.id || createId(prefix) }
        collection.unshift(nextItem)
        return nextItem
    }

    async login(email: string, password: string) {
        const database = this.readDatabase()
        const admin = database.admins.find((item) => item.email === email && item.password === password)

        if (!admin) {
            throw new Error('Invalid credentials. Use admin@yugo.com / admin123.')
        }

        const session: AdminSession = {
            adminId: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        }

        return session
    }

    getSession() {
        if (typeof window === 'undefined') {
            return null
        }

        const stored = localStorage.getItem(SESSION_KEY)
        return stored ? (JSON.parse(stored) as AdminSession) : null
    }

    async logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(SESSION_KEY)
        }
    }

    async listUsers() {
        return clone(this.readDatabase().users)
    }

    async saveUser(payload: Omit<User, 'id'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const user: User = { ...payload, id: payload.id ?? createId('user') }
            this.saveCollection(draft, 'users', user, 'user')
        })

        return clone(database.users.find((item) => item.id === payload.id) ?? database.users[0])
    }

    async disableUser(id: string) {
        const database = this.updateDatabase((draft) => {
            draft.users = draft.users.map((user) => (user.id === id ? { ...user, status: 'INACTIVE' } : user))
        })

        return clone(database.users.find((user) => user.id === id) ?? null)
    }

    async listStations() {
        return clone(this.readDatabase().stations)
    }

    async saveStation(payload: Omit<Station, 'id'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const station: Station = { ...payload, id: payload.id ?? createId('station') }
            this.saveCollection(draft, 'stations', station, 'station')
        })

        return clone(database.stations.find((item) => item.id === payload.id) ?? database.stations[0])
    }

    async listPlans(kind: 'plans' | 'topUpPlans') {
        return clone(this.readDatabase()[kind])
    }

    async savePlan(kind: 'plans' | 'topUpPlans', payload: Omit<Plan, 'id'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const plan: Plan = { ...payload, id: payload.id ?? createId(kind === 'plans' ? 'plan' : 'topup') }
            this.saveCollection(draft, kind, plan, kind === 'plans' ? 'plan' : 'topup')
        })

        return clone((database[kind] as Plan[]).find((item) => item.id === payload.id) ?? (database[kind] as Plan[])[0])
    }

    async listVehicles() {
        return clone(this.readDatabase().vehicles)
    }

    async saveVehicle(payload: Omit<Vehicle, 'id'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const vehicle: Vehicle = { ...payload, id: payload.id ?? createId('vehicle') }
            this.saveCollection(draft, 'vehicles', vehicle, 'vehicle')
        })

        return clone(database.vehicles.find((item) => item.id === payload.id) ?? database.vehicles[0])
    }

    async listMaintenance() {
        return clone(this.readDatabase().maintenance)
    }

    async saveMaintenance(payload: Omit<MaintenanceRecord, 'id'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const record: MaintenanceRecord = { ...payload, id: payload.id ?? createId('maintenance') }
            this.saveCollection(draft, 'maintenance', record, 'maintenance')

            draft.vehicles = draft.vehicles.map((vehicle) =>
                vehicle.id === record.vehicleId
                    ? {
                          ...vehicle,
                          status: record.status === 'RESOLVED' ? 'AVAILABLE' : 'IN_MAINTENANCE',
                      }
                    : vehicle,
            )
        })

        return clone(database.maintenance.find((item) => item.id === payload.id) ?? database.maintenance[0])
    }

    async listInactiveVehicles() {
        return clone(this.readDatabase().inactiveVehicles)
    }

    async saveInactiveVehicle(payload: Omit<InactiveVehicleRecord, 'id'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const record: InactiveVehicleRecord = { ...payload, id: payload.id ?? createId('inactive') }
            this.saveCollection(draft, 'inactiveVehicles', record, 'inactive')

            draft.vehicles = draft.vehicles.map((vehicle) =>
                vehicle.id === record.vehicleId
                    ? {
                          ...vehicle,
                          status: record.status === 'RESOLVED' ? 'AVAILABLE' : 'INACTIVE',
                      }
                    : vehicle,
            )
        })

        return clone(database.inactiveVehicles.find((item) => item.id === payload.id) ?? database.inactiveVehicles[0])
    }

    async listVehicleStationAssignments() {
        return clone(this.readDatabase().vehicleStationAssignments)
    }

    async assignVehicleToStation(payload: Omit<VehicleStationAssignment, 'id' | 'assignedAt' | 'status'>) {
        const database = this.updateDatabase((draft) => {
            draft.vehicleStationAssignments.unshift({
                id: createId('vs'),
                vehicleId: payload.vehicleId,
                stationId: payload.stationId,
                assignedAt: new Date().toISOString(),
                status: 'ASSIGNED',
            })

            draft.vehicles = draft.vehicles.map((vehicle) =>
                vehicle.id === payload.vehicleId
                    ? {
                          ...vehicle,
                          stationId: payload.stationId,
                          customerId: undefined,
                          status: 'ASSIGNED_TO_STATION',
                      }
                    : vehicle,
            )
        })

        return clone(database.vehicleStationAssignments[0])
    }

    async listCustomerRequests() {
        return clone(this.readDatabase().customerRequests)
    }

    async listCustomerVehicleAssignments() {
        return clone(this.readDatabase().customerVehicleAssignments)
    }

    async assignVehicleToCustomer(payload: Omit<CustomerVehicleAssignment, 'id' | 'assignedAt' | 'status'>) {
        const database = this.updateDatabase((draft) => {
            draft.customerVehicleAssignments.unshift({
                id: createId('vc'),
                vehicleId: payload.vehicleId,
                customerId: payload.customerId,
                assignedAt: new Date().toISOString(),
                status: 'ASSIGNED',
            })

            draft.customerRequests = draft.customerRequests.map((request) =>
                request.customerId === payload.customerId && request.status === 'PENDING'
                    ? { ...request, status: 'COMPLETED' }
                    : request,
            )

            draft.vehicles = draft.vehicles.map((vehicle) =>
                vehicle.id === payload.vehicleId
                    ? {
                          ...vehicle,
                          customerId: payload.customerId,
                          status: 'ASSIGNED_TO_CUSTOMER',
                      }
                    : vehicle,
            )
        })

        return clone(database.customerVehicleAssignments[0])
    }

    async listBatteries() {
        return clone(this.readDatabase().batteries)
    }

    async saveBattery(payload: Omit<Battery, 'id'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const battery: Battery = { ...payload, id: payload.id ?? createId('battery') }
            this.saveCollection(draft, 'batteries', battery, 'battery')
        })

        return clone(database.batteries.find((item) => item.id === payload.id) ?? database.batteries[0])
    }

    async listBatteryAssignments() {
        return clone(this.readDatabase().batteryStationAssignments)
    }

    async assignBatteriesToStation(payload: Omit<BatteryStationAssignment, 'id' | 'assignedAt' | 'status'>) {
        const database = this.updateDatabase((draft) => {
            draft.batteryStationAssignments.unshift({
                id: createId('battery-assignment'),
                stationId: payload.stationId,
                batteryIds: payload.batteryIds,
                assignedAt: new Date().toISOString(),
                status: 'ASSIGNED',
            })

            draft.batteries = draft.batteries.map((battery) =>
                payload.batteryIds.includes(battery.id)
                    ? {
                          ...battery,
                          stationId: payload.stationId,
                          status: 'AVAILABLE',
                      }
                    : battery,
            )
        })

        return clone(database.batteryStationAssignments[0])
    }

    async listSurrenders() {
        return clone(this.readDatabase().surrenders)
    }

    async saveSurrender(payload: Omit<VehicleSurrender, 'id' | 'submittedAt'> & { id?: string }) {
        const database = this.updateDatabase((draft) => {
            const surrender: VehicleSurrender = {
                ...payload,
                id: payload.id ?? createId('surrender'),
                submittedAt: new Date().toISOString(),
            }

            this.saveCollection(draft, 'surrenders', surrender, 'surrender')

            draft.customerVehicleAssignments = draft.customerVehicleAssignments.map((assignment) =>
                assignment.customerId === payload.customerId && assignment.vehicleId === payload.vehicleId
                    ? { ...assignment, status: 'COMPLETED' }
                    : assignment,
            )

            draft.vehicles = draft.vehicles.map((vehicle) =>
                vehicle.id === payload.vehicleId
                    ? {
                          ...vehicle,
                          customerId: undefined,
                          status: 'AVAILABLE',
                      }
                    : vehicle,
            )
        })

        return clone(database.surrenders.find((item) => item.id === payload.id) ?? database.surrenders[0])
    }

    async getDashboardSummary(): Promise<DashboardSummary> {
        const database = this.readDatabase()

        return {
            activeUsers: database.users.filter((user) => user.status === 'ACTIVE').length,
            activeStations: database.stations.filter((station) => station.status === 'ACTIVE').length,
            activePlans: database.plans.filter((plan) => plan.status === 'ACTIVE').length,
            availableVehicles: database.vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE').length,
            availableBatteries: database.batteries.filter((battery) => battery.status === 'AVAILABLE').length,
            pendingRequests: database.customerRequests.filter((request) => request.status === 'PENDING').length,
        }
    }
}

export const mockApi = new MockApi()
