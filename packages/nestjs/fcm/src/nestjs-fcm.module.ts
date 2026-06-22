import { Global, Module } from '@nestjs/common'
import {
    NestjsFcmConfigurableModuleClass,
    NESTJS_FCM_OPTIONS_TOKEN,
    NESTJS_FCM_OPTIONS_TYPE,
} from './configurable.module'
import { FcmService } from './fcm.service'

@Global()
@Module({
    providers: [
        {
            provide: FcmService,
            inject: [NESTJS_FCM_OPTIONS_TOKEN],
            useFactory(options: typeof NESTJS_FCM_OPTIONS_TYPE) {
                return new FcmService(options)
            },
        },
    ],
    exports: [FcmService],
})
export class NestjsFcmModule extends NestjsFcmConfigurableModuleClass {}
