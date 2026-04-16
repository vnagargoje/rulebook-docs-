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
import { CreatePlanCommand, UpdatePlanCommand } from '@yugo/cqrs';
import { Actions, PlanSubject } from '@yugo/permissions';
import { CreatePlanPayload, UpdatePlanPayload } from '../../dtos/payloads';
import { PlanResponse } from '../../dtos/responses';

@ApiTags('plans')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'admin/plans', version: '1' })
export class V1PlansAdminController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly accessService: AccessService,
    ) {}

    @ApiBody({ schema: CreatePlanPayload as object })
    @ApiResource(PlanResponse)
    @Post()
    async createPlan(
        @Body() body: Static<typeof CreatePlanPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new PlanSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to create plans');
        }
        return this.commandBus.execute(new CreatePlanCommand(body));
    }

    @ApiBody({ schema: UpdatePlanPayload as object })
    @ApiResource(PlanResponse)
    @Patch(':id')
    async updatePlan(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdatePlanPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.update,
                new PlanSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to update plans');
        }
        return this.commandBus.execute(new UpdatePlanCommand(id, body));
    }
}
