export class LicenseInitiateCommand {
    constructor(
        public readonly userId: string,
        public readonly payload: {
            dlNumber: string;
            dob: string;
        }
    ) {}
}
