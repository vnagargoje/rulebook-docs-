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
    TransactionEntity,
} from '@yugo/nestjs-database/entities';
import { BookingStatus, PaymentStatus, UserPlanStatus } from '@yugo/shared';
import { createHmac, randomInt } from 'crypto';
import { DataSource } from 'typeorm';

@ApiExcludeController()
@Controller({ path: 'webhooks', version: '1' })
export class V1WebhooksController {
    private readonly logger = new Logger(V1WebhooksController.name);

    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
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
                const transaction = await manager.findOne(TransactionEntity, {
                    where: { razorpayOrderId },
                    relations: ['userPlan'],
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

                transaction.userPlan.status = UserPlanStatus.PURCHASED;
                await manager.save(transaction.userPlan);

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

                this.logger.log(
                    `Webhook: Payment captured and plan activated for order ${razorpayOrderId}`,
                );
            });
        }

        if (event === 'payment.failed') {
            await manager.transaction(async (manager) => {
                const transaction = await manager.findOne(TransactionEntity, {
                    where: { razorpayOrderId },
                    relations: ['userPlan'],
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

                transaction.userPlan.status = UserPlanStatus.FAILED;
                await manager.save(transaction.userPlan);

                this.logger.log(
                    `Webhook: Payment failed for order ${razorpayOrderId}`,
                );
            });
        }

        return { status: 'ok' };
    }
}
