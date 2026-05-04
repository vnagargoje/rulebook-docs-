import { ClientOptionsFromInngest, Inngest } from 'inngest';

export type HenchmenInngestClient<T extends Inngest.Any = Inngest.Any> = ClientOptionsFromInngest<T>;
