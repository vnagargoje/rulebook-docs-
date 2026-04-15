import type { HubManagerMetric } from '@/types/hub-manager/hub-manager.types'

export const hubManagerContent = {
    heading: {
        eyebrow: 'Hub Manager',
        title: 'Coordinate handovers, staffing, and compliance',
        description: 'This persona layout is centered on hub throughput, team readiness, and customer handoff quality.',
    },
    hero: {
        eyebrow: 'Hub health',
        title: 'HSR Layout hub is prepared for the afternoon pickup wave',
        description: 'The current focus is clearing document approvals and staging two vehicles for express handover.',
    },
} as const

export const hubManagerMetrics: HubManagerMetric[] = [
    {
        id: 'intake',
        title: 'Vehicle intake',
        value: '11 arrivals',
        description:
            'Three new customer pickups are scheduled before lunch, and pre-delivery checks are already underway.',
    },
    {
        id: 'staffing',
        title: 'Staff coverage',
        value: '7 on shift',
        description:
            'The evening handover is fully staffed, with one reserve agent available for onboarding escalations.',
    },
    {
        id: 'compliance',
        title: 'Pending reviews',
        value: '4 documents',
        description: 'KYC and handover paperwork needs final validation before the next pickup block opens.',
    },
]
