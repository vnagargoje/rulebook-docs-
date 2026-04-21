export class VerifyInwardBatteryCommand {
    constructor(
        public readonly bookingId: string,
        public readonly batteryQrId: string,
    ) {}
}
