export class DispatchBatteriesCommand {
    constructor(
        public readonly fromStationId: string,
        public readonly toStationId: string,
        public readonly vehicleId: string,
        public readonly batteryQrIds: string[],
        public readonly initiatedById: string,
    ) {}
}
