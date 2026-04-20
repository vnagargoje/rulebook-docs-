export class ReceiveBatteriesCommand {
    constructor(
        public readonly transportId: string,
        public readonly batteryQrIds: string[],
        public readonly receivedById: string,
    ) {}
}
