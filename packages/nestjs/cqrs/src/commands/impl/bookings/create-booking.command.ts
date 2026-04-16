export class CreateBookingCommand {
    constructor(
        public readonly userId: string,
        public readonly userPlanId: string,
        public readonly stationId: string,
    ) {}
}
