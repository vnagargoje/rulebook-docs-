import { ApiResource } from '@/decorators/api-resource.decorator';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import { type ContextUserType } from '@/types/context-user';
import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { type Static } from '@sinclair/typebox';
import { CreateBookingCommand } from '@yugo/cqrs';
import { BookingEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { CreateBookingPayload } from '../../dtos/payloads';
import { BookingResponse } from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<BookingEntity> = {
    sortableColumns: ['id', 'status', 'createdAt'],
    defaultLimit: 50,
    filterableColumns: {
        status: [FilterOperator.EQ, FilterOperator.IN],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'bookings', version: '1' })
export class V1BookingsController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiResource(BookingResponse, PAGINATE_CONFIG)
    @Get()
    async getMyBookings(
        @Paginate() query: PaginateQuery,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const qb = this.datasource.manager
            .createQueryBuilder(BookingEntity, 'booking')
            .innerJoin('booking.userPlan', 'userPlan')
            .where('userPlan.userId = :userId', { userId: user.id });
        return paginate(query, qb, PAGINATE_CONFIG);
    }

    @ApiResource(BookingResponse)
    @Get(':id')
    async getBookingById(
        @Param('id') id: string,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const booking = await this.datasource.manager
            .createQueryBuilder(BookingEntity, 'booking')
            .innerJoin('booking.userPlan', 'userPlan')
            .where('booking.id = :id AND userPlan.userId = :userId', {
                id,
                userId: user.id,
            })
            .getOne();
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
        return booking;
    }

    @ApiBody({ schema: CreateBookingPayload })
    @ApiResource(BookingResponse)
    @Post()
    async createBooking(
        @Body() body: Static<typeof CreateBookingPayload>,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        return this.commandBus.execute(
            new CreateBookingCommand(user.id, body.userPlanId, body.stationId),
        );
    }
}
