export type BatteryStatus = 'available' | 'charged' | 'charging' | 'drained' | 'in_transit' | 'in_use' | 'under_maintenance'

export interface StatusConfig {
    label: string
    icon: string
    iconColor: string
    bg: string
    text: string
}

export const STATUS_CONFIG: Record<BatteryStatus, StatusConfig> = {
    available: {
        label: 'Available',
        icon: 'battery-check',
        iconColor: '#059669',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
    },
    charged: {
        label: 'Charged',
        icon: 'battery-high',
        iconColor: '#2563EB',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
    },
    charging: {
        label: 'Charging',
        icon: 'battery-charging',
        iconColor: '#D97706',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
    },
    drained: {
        label: 'Drained',
        icon: 'battery-low',
        iconColor: '#EF4444',
        bg: 'bg-red-50',
        text: 'text-red-600',
    },
    in_transit: {
        label: 'In Transit',
        icon: 'truck-fast-outline',
        iconColor: '#7C3AED',
        bg: 'bg-violet-50',
        text: 'text-violet-700',
    },
    in_use: {
        label: 'In Use',
        icon: 'lightning-bolt',
        iconColor: '#0891B2',
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
    },
    under_maintenance: {
        label: 'Maintenance',
        icon: 'wrench',
        iconColor: '#64748B',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
    },
}
