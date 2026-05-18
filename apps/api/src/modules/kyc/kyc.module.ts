import { Module } from '@nestjs/common';
import { 
    AadhaarGenerateOtpHandler, 
    AadhaarReloadCaptchaHandler, 
    AadhaarStartSessionHandler, 
    AadhaarVerifyOtpHandler, 
    LicenseGetResultHandler, 
    LicenseInitiateHandler, 
    PanVerifyHandler,
    GetKycStatusHandler,
    UpdateKycStatusHandler,
    ApplyManualKycHandler
} from '@yugo/cqrs';
import { AadhaarController } from './controllers/v1/aadhaar.controller.js';
import { PanController } from './controllers/v1/pan.controller.js';
import { LicenseController } from './controllers/v1/license.controller.js';
import { KycController } from './controllers/v1/kyc.controller.js';

const Handlers = [
    AadhaarGenerateOtpHandler,
    AadhaarReloadCaptchaHandler,
    AadhaarStartSessionHandler,
    AadhaarVerifyOtpHandler,
    LicenseGetResultHandler,
    LicenseInitiateHandler,
    PanVerifyHandler,
    GetKycStatusHandler,
    UpdateKycStatusHandler,
    ApplyManualKycHandler,
];

@Module({
    controllers: [
        AadhaarController,
        PanController,
        LicenseController,
        KycController,
    ],
    providers: [...Handlers],
})
export class KycModule {}
