export type VerifyOtpParams = {
    code: string;
    mobilenumber: string;
};

export type SendOtpParams = {
    mobilenumber: string;
};

export type VerifyOtpResult = {
    status: 'approved' | 'failed';
};

export interface OtpService {
    sendOtp(params: SendOtpParams): Promise<void>;
    verifyOtp(params: VerifyOtpParams): Promise<VerifyOtpResult>;
    resendOtp(mobilenumber: string): Promise<{ type: string; message: string }>;
}
