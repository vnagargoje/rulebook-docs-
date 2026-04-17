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
