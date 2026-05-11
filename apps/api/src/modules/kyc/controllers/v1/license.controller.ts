import { ApiResource } from '@/decorators/api-resource.decorator.js';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator.js';
import { AppAuthGuard } from '@/guards/app.guard.js';
import { type ContextUserType } from '@/types/context-user.js';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { type Static } from '@sinclair/typebox';
import { LicenseGetResultCommand, LicenseInitiateCommand } from '@yugo/cqrs';
import { LicenseInitiatePayload } from '../../dtos/payloads.js';
import {
    GenericKycResponse,
    LicenseInitiateResponse,
} from '../../dtos/responses.js';

@ApiTags('kyc')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'kyc/license', version: '1' })
export class LicenseController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiBody({ schema: LicenseInitiatePayload })
    @ApiResource(LicenseInitiateResponse)
    @Post('initiate')
    async initiate(
        @AuthenticatedUser() user: ContextUserType,
        @Body() body: Static<typeof LicenseInitiatePayload>
    ) {
        return this.commandBus.execute(
            new LicenseInitiateCommand(user.id, { ...body, dob: body.dateOfBirth }),
        );
    }

    @ApiResource(GenericKycResponse)
    @Get('result')
    async getResult(
        @AuthenticatedUser() user: ContextUserType,
        @Query('requestId') requestId: string,
    ) {
        return this.commandBus.execute(
            new LicenseGetResultCommand(user.id, requestId),
        );
    }
}
