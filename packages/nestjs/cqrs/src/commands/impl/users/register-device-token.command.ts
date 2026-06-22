export class RegisterDeviceTokenCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceToken: string,
    ) {}
}
