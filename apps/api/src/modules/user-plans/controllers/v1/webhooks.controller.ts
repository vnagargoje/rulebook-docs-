import { Public } from '@/decorators/public.decorator';
import {
    BadRequestException,
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import {
    BookingEntity,
    TopUpEntity,
    TransactionEntity,
    UserPlanEntity,
    UserTopUpEntity,
} from '@yugo/nestjs-database/entities';
import { BookingStatus, PaymentStatus, UserPlanStatus, UserTopUpStatus } from '@yugo/shared';
import { createHmac, randomInt } from 'crypto';
import { DataSource } from 'typeorm';
import { InjectInngestService } from '@yugo/nestjs-inngest';
import { type HenchmenInngestClient } from '@yugo/utils';

@ApiExcludeController()
@Controller({ path: 'webhooks', version: '1' })
export class V1WebhooksController {
    private readonly logger = new Logger(V1WebhooksController.name);

    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
        @InjectInngestService() private readonly inngest: HenchmenInngestClient,
    ) {}

    @Public()
    @Post('razorpay')
    @HttpCode(HttpStatus.OK)
    async handleRazorpayWebhook(
        @Body() body: any,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        const webhookSecret = this.configService.getOrThrow<string>(
            'razorpay.config.webhookSecret',
        );

        const expectedSignature = createHmac('sha256', webhookSecret)
            .update(JSON.stringify(body))
            .digest('hex');

        if (expectedSignature !== signature) {
            this.logger.error('Invalid Razorpay webhook signature');
            throw new BadRequestException('Invalid webhook signature');
        }

        const event = body.event;
        const payment = body.payload?.payment?.entity;

        if (!payment) {
            this.logger.warn('Webhook received without payment entity');
            return { status: 'ok' };
        }

        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;
        const manager = this.datasource.manager;

        if (event === 'payment.captured') {
            await manager.transaction(async (manager) => {
                // Pessimistic lock prevents race with client /verify-payment
                const transaction = await manager.findOne(TransactionEntity, {
                    where: { razorpayOrderId },
                    relations: ['userPlan'],
                    lock: { mode: 'pessimistic_write' },
                });

                if (!transaction) {
                    this.logger.warn(
                        `Webhook: Transaction not found for order ${razorpayOrderId}`,
                    );
                    return;
                }

                if (transaction.status !== PaymentStatus.AWAITING) {
                    this.logger.log(
                        `Webhook: Transaction ${razorpayOrderId} already processed (status: ${transaction.status})`,
                    );
                    return;
                }

                transaction.status = PaymentStatus.SUCCEEDED;
                transaction.razorpayPaymentId = razorpayPaymentId;
                transaction.notes = JSON.stringify(payment);
                await manager.save(transaction);

                // Only activate plan and create booking for plan purchases.
                // Top-up payments are finalised here too — apply km/validity to the plan.
                if (!transaction.userTopUpId) {
                    transaction.userPlan.status = UserPlanStatus.PURCHASED;
                    await manager.save(transaction.userPlan);

                    const activePlan = await manager.findOne(UserPlanEntity, {
                        where: { userId: transaction.userPlan.userId, status: UserPlanStatus.ACTIVE },
                    });

                    if (activePlan && activePlan.expiresAt) {
                        await this.inngest.send({
                            name: 'plan/userPlan.activate',
                            data: {
                                userId: transaction.userPlan.userId,
                                userPlanId: transaction.userPlan.id,
                            },
                            ts: activePlan.expiresAt.getTime(),
                        });
                    }

                    const pickupOtp = String(randomInt(1000, 10000));
                    const booking = manager.create(BookingEntity, {
                        userPlanId: transaction.userPlan.id,
                        stationId: null,
                        vehicleId: null,
                        batteryId: null,
                        status: BookingStatus.CREATED,
                        pickupOtp,
                    });
                    await manager.save(booking);
                } else {
                    // Apply the top-up: mirrors VerifyTopUpPaymentHandler.
                    // This path executes when the webhook wins the race against the client.
                    const userTopUp = await manager.findOne(UserTopUpEntity, {
                        where: { id: transaction.userTopUpId },
                    });

                    if (userTopUp && !userTopUp.appliedAt) {
                        const topUp = await manager.findOne(TopUpEntity, {
                            where: { id: userTopUp.topUpId },
                        });
                        const userPlan = await manager.findOne(UserPlanEntity, {
                            where: { id: userTopUp.userPlanId },
                        });

                        if (topUp && userPlan) {
                            userTopUp.status = UserTopUpStatus.APPLIED;
                            userTopUp.appliedAt = new Date();
                            // Keep the snapshot already set at order-creation time;
                            // only fill it in if it's missing (legacy rows).
                            if (!userTopUp.topUpSnapshot) {
                                userTopUp.topUpSnapshot = {
                                    name: topUp.name,
                                    description: topUp.description,
                                    kmLimit: topUp.kmLimit,
                                    price: topUp.price,
                                    gstPercentage: topUp.gstPercentage,
                                    gstAmount: (Number(topUp.price) * Number(topUp.gstPercentage || 0)) / 100,
                                };
                            }
                            await manager.save(userTopUp);

                            userPlan.remainingKm =
                                Number(userPlan.remainingKm) + Number(topUp.kmLimit);
                            userPlan.totalKm =
                                Number(userPlan.totalKm) + Number(topUp.kmLimit);

                            await manager.save(userPlan);
                        }
                    }
                }

                this.logger.log(
                    `Webhook: Payment captured for order ${razorpayOrderId} (topUp=${!!transaction.userTopUpId})`,
                );
            });
        }

        if (event === 'payment.failed') {
            await manager.transaction(async (manager) => {
                // Pessimistic lock prevents race with client /verify-payment
                const transaction = await manager.findOne(TransactionEntity, {
                    where: { razorpayOrderId },
                    relations: ['userPlan'],
                    lock: { mode: 'pessimistic_write' },
                });

                if (
                    !transaction ||
                    transaction.status !== PaymentStatus.AWAITING
                ) {
                    return;
                }

                transaction.status = PaymentStatus.FAILED;
                transaction.razorpayPaymentId = razorpayPaymentId;
                transaction.notes = JSON.stringify(payment);
                await manager.save(transaction);

                // Only mark the user plan as FAILED for plan purchases.
                // Top-up failures must NOT change the plan status.
                if (!transaction.userTopUpId) {
                    transaction.userPlan.status = UserPlanStatus.FAILED;
                    await manager.save(transaction.userPlan);
                }

                this.logger.log(
                    `Webhook: Payment failed for order ${razorpayOrderId}`,
                );
            });
        }

        return { status: 'ok' };
    }
}
