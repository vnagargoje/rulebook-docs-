import { ConfigurableModuleBuilder } from '@nestjs/common'
import { CaslModuleOptions } from './interfaces'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
    new ConfigurableModuleBuilder<CaslModuleOptions>()
        .setClassMethodName('forRoot')
        .setExtras(
            {
                isGlobal: true,
            },
            (definition, extras) => ({
                ...definition,
                global: extras.isGlobal,
            }),
        )
        .build()
