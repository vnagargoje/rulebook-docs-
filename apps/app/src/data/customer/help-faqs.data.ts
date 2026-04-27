export type HelpFaq = {
    q: string
    a: string
}

export const HELP_FAQS: HelpFaq[] = [
    {
        q: 'How do I cancel a booking?',
        a: 'Open the booking detail and tap "Cancel booking" before the pickup time.',
    },
    {
        q: 'When does my plan expire?',
        a: 'Plan validity starts from the date of your first booking and runs for the plan duration.',
    },
    {
        q: 'What if I run out of KM?',
        a: 'Top up your active plan anytime from the Plans tab to add extra kilometres.',
    },
    {
        q: 'How is the pickup OTP used?',
        a: 'Show your OTP to the station attendant to verify and collect your assigned vehicle.',
    },
]
