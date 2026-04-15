export class LicenseInitiateCommand {
    constructor(
        public readonly payload: {
            dlNumber: string;
            dob: string;
        }
    ) {}
}
