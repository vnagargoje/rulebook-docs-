import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface NestjsFcmOptions {
    projectId?: string
    clientEmail?: string
    privateKey?: string
    serviceAccountJson?: string
}

export const {
    OPTIONS_TYPE: NESTJS_FCM_OPTIONS_TYPE,
    ASYNC_OPTIONS_TYPE: NESTJS_FCM_ASYNC_OPTIONS_TYPE,
    MODULE_OPTIONS_TOKEN: NESTJS_FCM_OPTIONS_TOKEN,
    ConfigurableModuleClass: NestjsFcmConfigurableModuleClass,
} = new ConfigurableModuleBuilder<NestjsFcmOptions>()
    .setClassMethodName('forRoot')
    .setExtras({ global: true }, (def, { global }) => {
        return {
            ...def,
            global,
        }
    })
    .build()
