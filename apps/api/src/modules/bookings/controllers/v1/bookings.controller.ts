import { ApiResource } from '@/decorators/api-resource.decorator';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import { type ContextUserType } from '@/types/context-user';
import {
    Controller,
    Get,
    NotFoundException,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { SystemRoles } from '@yugo/shared';
import { BookingEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
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
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    @ApiResource(BookingResponse, PAGINATE_CONFIG)
    @Get()
    async getAllBookings(
        @Paginate() query: PaginateQuery,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const isAdmin = user.roles.includes(SystemRoles.SYSTEM_ADMIN);
        const qb = this.datasource.manager
            .createQueryBuilder(BookingEntity, 'booking')
            .innerJoinAndSelect('booking.userPlan', 'userPlan')
            .leftJoinAndSelect('userPlan.user', 'user')
            .leftJoinAndSelect('userPlan.plan', 'plan')
            .leftJoinAndSelect('userPlan.qrCode', 'qrCode')
            .leftJoinAndSelect('userPlan.topUps', 'topUps')
            .leftJoinAndSelect('booking.station', 'station')
            .leftJoinAndSelect('booking.vehicle', 'vehicle')
            .leftJoinAndSelect('booking.battery', 'battery');
        if (!isAdmin) {
            qb.where('userPlan.userId = :userId', { userId: user.id });
        }
        const result = await paginate(query, qb, PAGINATE_CONFIG);
        if (isAdmin) {
            result.data.forEach((b) => {
                delete (b as any).pickupOtp;
            });
        }
        return result;
    }

    @ApiResource(BookingResponse)
    @Get(':id')
    async getBookingById(
        @Param('id') id: string,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const isAdmin = user.roles.includes(SystemRoles.SYSTEM_ADMIN);
        const qb = this.datasource.manager
            .createQueryBuilder(BookingEntity, 'booking')
            .innerJoinAndSelect('booking.userPlan', 'userPlan')
            .leftJoinAndSelect('userPlan.user', 'user')
            .leftJoinAndSelect('userPlan.plan', 'plan')
            .leftJoinAndSelect('userPlan.qrCode', 'qrCode')
            .leftJoinAndSelect('userPlan.topUps', 'topUps')
            .leftJoinAndSelect('booking.station', 'station')
            .leftJoinAndSelect('booking.vehicle', 'vehicle')
            .leftJoinAndSelect('booking.battery', 'battery');

        if (isAdmin) {
            qb.where('booking.id = :id', { id });
        } else {
            qb.where('booking.id = :id AND userPlan.userId = :userId', {
                id,
                userId: user.id,
            });
        }

        const booking = await qb.getOne();
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (isAdmin) {
            delete (booking as any).pickupOtp;
        }

        return booking;
    }
}
