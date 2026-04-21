export class ExecuteBatterySwapCommand {
    constructor(
        public readonly bookingId: string,
        public readonly newBatteryQrId: string,
        public readonly stationId: string,
        public readonly swappedById: string,
    ) {}
}
