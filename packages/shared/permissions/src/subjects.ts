import { Subjects } from './constants'

export class UserSubject {
    static get modelName() {
        return Subjects.User
    }
}

export class PlanSubject {
    static get modelName() {
        return Subjects.Plan
    }
}

export class TopUpSubject {
    static get modelName() {
        return Subjects.TopUp
    }
}

export class UserPlanSubject {
    static get modelName() {
        return Subjects.UserPlan
    }
}

export class BookingSubject {
    static get modelName() {
        return Subjects.Booking
    }
}

export class StationSubject {
    static get modelName() {
        return Subjects.Station
    }
}

export class VehicleSubject {
    static get modelName() {
        return Subjects.Vehicle
    }
}

export class BatterySubject {
    static get modelName() {
        return Subjects.Battery
    }
}

export class BatteryTransportSubject {
    static get modelName() {
        return Subjects.BatteryTransport
    }
}

export class BatterySwapSubject {
    static get modelName() {
        return Subjects.BatterySwap
    }
}
