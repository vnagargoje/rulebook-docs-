import { Inject } from '@nestjs/common';
import { Inngest } from 'inngest';
import { INNGEST_FUNCTION, INNGEST_KEY } from './constants';

export const InjectInngestService = () => {
    return Inject( INNGEST_KEY );
};

export const NestjsInngestFunction = <T extends Inngest.Any = Inngest.Any>(
    arg: Parameters<Inngest.CreateFunction<T>>[0],
    options?: Parameters<Inngest.CreateFunction<T>>[1],
) => {
    return ( target: object, key: string | symbol, descriptor: PropertyDescriptor ) => {
        Reflect.defineMetadata( INNGEST_FUNCTION, [ arg, options ?? {} ], descriptor.value );
    };
};
