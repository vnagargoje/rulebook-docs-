import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { type Static } from '@sinclair/typebox';
import { type Request } from 'express';
import { AccessService } from '@yugo/nestjs-casl';
import { CreateTopUpCommand, UpdateTopUpCommand } from '@yugo/cqrs';
import { Actions, TopUpSubject } from '@yugo/permissions';
import { CreateTopUpPayload, UpdateTopUpPayload } from '../../dtos/payloads';
import { TopUpResponse } from '../../dtos/responses';

@ApiTags('top-ups')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'admin/top-ups', version: '1' })
export class V1TopUpsAdminController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly accessService: AccessService,
    ) {}

    @ApiBody({ schema: CreateTopUpPayload as object })
    @ApiResource(TopUpResponse)
    @Post()
    async createTopUp(
        @Body() body: Static<typeof CreateTopUpPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new TopUpSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to create top-ups');
        }
        return this.commandBus.execute(new CreateTopUpCommand(body));
    }

    @ApiBody({ schema: UpdateTopUpPayload as object })
    @ApiResource(TopUpResponse)
    @Patch(':id')
    async updateTopUp(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdateTopUpPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.update,
                new TopUpSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to update top-ups');
        }
        return this.commandBus.execute(new UpdateTopUpCommand(id, body));
    }
}
