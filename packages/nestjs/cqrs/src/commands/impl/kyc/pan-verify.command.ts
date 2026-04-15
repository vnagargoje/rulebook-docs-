export class PanVerifyCommand {
    constructor(
        public readonly userId: string,
        public readonly pan: string,
    ) {}
}
