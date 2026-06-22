import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { type Static, Type } from '@sinclair/typebox';
import { type Request } from 'express';
import { AccessService } from '@yugo/nestjs-casl';
import {
    CreateNotificationCommand,
    UpdateNotificationCommand,
    DeleteNotificationCommand,
    GetNotificationsQuery,
    GetNotificationQuery,
    NOTIFICATION_PAGINATE_CONFIG,
} from '@yugo/cqrs';
import { Actions, NotificationSubject } from '@yugo/permissions';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { CreateNotificationPayload, UpdateNotificationPayload } from '../../dtos/payloads';
import { InngestEventResponse, NotificationResponse } from '../../dtos/responses';
import { inngestEvents } from '@yugo/utils';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'notifications', version: '1' })
export class V1NotificationsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly accessService: AccessService,
    ) {}

    @ApiBody({ schema: CreateNotificationPayload as object })
    @ApiResource(NotificationResponse)
    @Post()
    async createNotification(
        @Body() body: Static<typeof CreateNotificationPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new NotificationSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to create notifications');
        }
        return this.commandBus.execute(new CreateNotificationCommand(body));
    }

    @Get()
    @ApiResource(NotificationResponse, NOTIFICATION_PAGINATE_CONFIG)
    async getNotifications(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new NotificationSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to read notifications');
        }
        return this.queryBus.execute(new GetNotificationsQuery(query));
    }

    @Get('inngest-events')
    @ApiResource(Type.Array(InngestEventResponse))
    async getInngestEvents(@Req() req: Request) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new NotificationSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to read notifications');
        }
        return inngestEvents;
    }

    @Get(':id')
    @ApiResource(NotificationResponse)
    async getNotification(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new NotificationSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to read notifications');
        }
        return this.queryBus.execute(new GetNotificationQuery(id));
    }

    @ApiBody({ schema: UpdateNotificationPayload as object })
    @ApiResource(NotificationResponse)
    @Patch(':id')
    async updateNotification(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdateNotificationPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.update,
                new NotificationSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to update notifications');
        }
        return this.commandBus.execute(new UpdateNotificationCommand(id, body));
    }

    @Delete(':id')
    async deleteNotification(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.delete,
                new NotificationSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to delete notifications');
        }
        return this.commandBus.execute(new DeleteNotificationCommand(id));
    }
}
