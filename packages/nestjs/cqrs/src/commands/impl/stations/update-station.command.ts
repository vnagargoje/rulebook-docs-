import { CreateStationPayload } from './create-station.command'

export type UpdateStationPayload = Partial<CreateStationPayload>

export class UpdateStationCommand {
    constructor(
        public readonly stationId: string,
        public readonly payload: UpdateStationPayload,
    ) {}
}
