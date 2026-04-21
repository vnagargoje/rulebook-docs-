export class AssignVehicleToBookingCommand {
    constructor(
        public readonly bookingId: string,
        public readonly vehicleId: string,
        public readonly batteryId: string,
        public readonly otp: string,
    ) {}
}
