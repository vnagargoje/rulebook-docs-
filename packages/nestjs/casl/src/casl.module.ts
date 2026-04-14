import { DynamicModule, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { AccessService } from './access.service'
import { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } from './base.module'

@Module({
    imports: [DiscoveryModule],
    providers: [AccessService],
    exports: [AccessService],
})
export class CaslModule extends ConfigurableModuleClass {
    static forRoot(opts: typeof OPTIONS_TYPE): DynamicModule {
        const dynm = super.forRoot(opts)
        return {
            ...dynm,
            providers: [...(dynm.providers || [])],
            exports: [...(dynm.exports || []), ...(dynm.providers || [])],
        }
    }

    static forRootAsync(opts: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
        const dynm = super.forRootAsync(opts)
        return {
            ...dynm,
        }
    }
}
