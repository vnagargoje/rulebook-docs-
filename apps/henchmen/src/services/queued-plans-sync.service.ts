import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserPlanEntity } from '@yugo/nestjs-database/entities';
import { UserPlanStatus } from '@yugo/shared';
import { InjectInngestService } from '@yugo/nestjs-inngest';
import { type HenchmenInngestClient } from '@yugo/utils';

@Injectable()
export class QueuedPlansSyncService implements OnApplicationBootstrap {
    private readonly logger = new Logger(QueuedPlansSyncService.name);

    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        @InjectInngestService() private readonly inngest: HenchmenInngestClient,
    ) {}
    async onApplicationBootstrap() {
        this.logger.log('Syncing queued user plans to Inngest...');

        try {
            const purchasedPlans = await this.dataSource.manager.find(UserPlanEntity, {
                where: { status: UserPlanStatus.PURCHASED },
            });

            if (purchasedPlans.length === 0) {
                this.logger.log('No queued purchased plans found to sync.');
                return;
            }

            for (const plan of purchasedPlans) {
                const activePlan = await this.dataSource.manager.findOne(UserPlanEntity, {
                    where: { userId: plan.userId, status: UserPlanStatus.ACTIVE },
                });

                if (activePlan && activePlan.expiresAt) {
                    await this.inngest.send({
                        name: 'plan/userPlan.activate',
                        data: {
                            userId: plan.userId,
                            userPlanId: plan.id,
                        },
                        ts: activePlan.expiresAt.getTime(),
                    });
                    this.logger.log(`Scheduled queued plan activation for userPlanId: ${plan.id}`);
                }
            }

            this.logger.log(`Successfully synced queued plans.`);
        } catch (error) {
            this.logger.error('Failed to sync queued plans to Inngest', error);
        }
    }
}
