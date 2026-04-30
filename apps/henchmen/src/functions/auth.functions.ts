import { Injectable } from '@nestjs/common';
import { NestjsInngestFunction } from '@yugo/nestjs-inngest';
import { HenchmenInngestClient } from '@yugo/utils';
import { type GetFunctionInput } from 'inngest';

@Injectable()
export class AuthFunctions {
    constructor() {}

    @NestjsInngestFunction<HenchmenInngestClient>(
        { id: 'sendOtp' },
        { event: 'auth/otp.send' },
    )
    async sendOtp({
        event,
    }: GetFunctionInput<HenchmenInngestClient, 'auth/otp.send'>) {
        return null;
    }
}
