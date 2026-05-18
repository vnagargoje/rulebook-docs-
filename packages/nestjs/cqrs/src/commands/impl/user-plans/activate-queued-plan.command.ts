export class ActivateQueuedPlanCommand {
    constructor(
        public readonly userId: string,
        public readonly userPlanId: string,
    ) {}
}
