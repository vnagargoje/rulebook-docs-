export class SurrenderVehicleCommand {
    constructor(
        public readonly vehicleNumber: string,
        public readonly penalty: number,
        public readonly miscCharges: number,
        public readonly refundAmount: number,
        public readonly notes: string | null,
    ) {}
}
