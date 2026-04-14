import { Injectable } from '@nestjs/common';
import {
    OtpService,
    SendOtpParams,
    VerifyOtpParams,
    VerifyOtpResult,
} from './otp-service.interface.js';

const VALID_OTPS = new Set(['1111', '2222']);

@Injectable()
export class MockOtpService implements OtpService {
    async sendOtp(_params: SendOtpParams) {
        // Mock OTP sending is intentionally a no-op.
    }

    async verifyOtp({ code }: VerifyOtpParams): Promise<VerifyOtpResult> {
        return {
            status: VALID_OTPS.has(code) ? 'approved' : 'failed',
        } as VerifyOtpResult;
    }
}
