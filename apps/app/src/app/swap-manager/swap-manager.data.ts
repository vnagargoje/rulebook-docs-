import type { SwapManagerMetric } from './swap-manager.types'

export const swapManagerContent = {
    heading: {
        eyebrow: 'Swap Manager',
        title: 'Monitor swap demand and battery readiness',
        description:
            'This persona layout is focused on queue visibility, battery inventory, and service response time.',
    },
    hero: {
        eyebrow: 'Operations snapshot',
        title: 'Koramangala station is running at 92% readiness',
        description: 'One technician is handling a delayed dock reset while the rest of the queue remains on schedule.',
    },
} as const

export const swapManagerMetrics: SwapManagerMetric[] = [
    {
        id: 'queue',
        title: 'Queued swaps',
        value: '18',
        description: 'Two vehicles are due in the next 15 minutes, with one delayed handoff that needs attention.',
    },
    {
        id: 'inventory',
        title: 'Charged batteries',
        value: '42',
        description: 'Inventory is healthy for the afternoon window, but station 3 needs balancing before 5 PM.',
    },
    {
        id: 'sla',
        title: 'Average SLA',
        value: '6 min',
        description: 'Service time is staying inside the target range for active customer swaps today.',
    },
]
