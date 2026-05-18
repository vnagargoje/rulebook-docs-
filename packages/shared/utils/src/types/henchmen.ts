import { EventSchemas, Inngest } from 'inngest';

const inngest = new Inngest( {
    id: '',
    schemas: new EventSchemas().fromRecord<{
        'auth/otp.send': {
            data: {
                channel: 'sms' | 'email' | 'whatsapp' | 'call' | 'sna';
                to: string;
            };
        };
        'plan/userPlan.activate': {
            data: {
                userId: string;
                userPlanId: string;
            };
        };
    }>(),
} );

export type HenchmenInngestClient = typeof inngest;
