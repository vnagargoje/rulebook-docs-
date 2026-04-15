import { ApiResource } from '@/decorators/api-resource.decorator.js';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator.js';
import { AppAuthGuard } from '@/guards/app.guard.js';
import { type ContextUserType } from '@/types/context-user.js';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetKycStatusQuery } from '@yugo/cqrs';
import { KycStatusResponse } from '../../dtos/responses.js';

@ApiTags('kyc')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'kyc', version: '1' })
export class KycController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiResource(KycStatusResponse)
    @Get('status')
    async getStatus(@AuthenticatedUser() user: ContextUserType) {
        return this.queryBus.execute(new GetKycStatusQuery(user.id));
    }
}
