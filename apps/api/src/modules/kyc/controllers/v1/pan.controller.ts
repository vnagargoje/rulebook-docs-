import { ApiResource } from '@/decorators/api-resource.decorator';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import { type ContextUserType } from '@/types/context-user';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { type Static } from '@sinclair/typebox';
import { PanVerifyCommand } from '@yugo/cqrs';
import { PanVerifyPayload } from '../../dtos/payloads.js';
import { GenericKycResponse } from '../../dtos/responses.js';

@ApiTags('kyc')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'kyc/pan', version: '1' })
export class PanController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiBody({ schema: PanVerifyPayload })
    @ApiResource(GenericKycResponse)
    @Post('verify')
    async verify(
        @AuthenticatedUser() user: ContextUserType,
        @Body() body: Static<typeof PanVerifyPayload>,
    ) {
        return this.commandBus.execute(new PanVerifyCommand(user.id, body.pan));
    }
}
