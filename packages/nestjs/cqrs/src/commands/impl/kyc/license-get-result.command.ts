export class LicenseGetResultCommand {
    constructor(
        public readonly userId: string,
        public readonly requestId: string
    ) {}
}
