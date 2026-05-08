import { PlanEntity } from '@yugo/nestjs-database/entities'

export class GetAccuratePlanPricesQuery {
    constructor(
        public readonly plans: PlanEntity[],
        public readonly userId?: string,
    ) {}
}
