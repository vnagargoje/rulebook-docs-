import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NestjsInngestFunction } from '@yugo/nestjs-inngest';
import { HenchmenInngestClient } from '@yugo/utils';
import { type GetFunctionInput } from 'inngest';
import { ActivateQueuedPlanCommand } from '@yugo/cqrs';

@Injectable()
export class UserPlanFunctions {
    private readonly logger = new Logger(UserPlanFunctions.name);

    constructor(private readonly commandBus: CommandBus) {}

    @NestjsInngestFunction<HenchmenInngestClient>(
        { id: 'activateQueuedPlan' },
        { event: 'plan/userPlan.activate' },
    )
    async activateQueuedPlan({
        event,
    }: GetFunctionInput<HenchmenInngestClient, 'plan/userPlan.activate'>) {
        this.logger.log(
            `Received activate-queued-plan event for userPlanId: ${event.data.userPlanId}`,
        );
        await this.commandBus
            .execute(
                new ActivateQueuedPlanCommand(
                    event.data.userId,
                    event.data.userPlanId,
                ),
            )
            .then(() => {
                this.logger.log(
                    `Successfully activated queued plan for userPlanId: ${event.data.userPlanId}`,
                );
            });

        return null;
    }
}
