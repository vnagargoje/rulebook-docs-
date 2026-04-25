// ─── Inventory ────────────────────────────────────────────────────────────────

export type MovementFilterTab = 'in_transit' | 'delivered'

export const MOVEMENT_STATUS_LABELS: Record<MovementFilterTab, string> = {
    in_transit: 'In Transit',
    delivered: 'Delivered',
}

export const MOVEMENT_STATUS_COLORS: Record<MovementFilterTab, { bg: string; text: string; dot: string }> = {
    in_transit: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B' },
    delivered: { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
}

// ─── Battery Inward ───────────────────────────────────────────────────────────

export const INWARD_STEP_LABELS = ['Select Movement', 'Scan Batteries', 'Confirm'] as const

export const INWARD_STEP_INDEX: Record<string, number> = {
    'select-movement': 0,
    scan: 1,
    confirm: 2,
}

// ─── Battery Outward ──────────────────────────────────────────────────────────

export const OUTWARD_STEP_LABELS = ['Destination', 'Vehicle', 'Scan', 'Confirm'] as const

export const OUTWARD_STEP_INDEX: Record<string, number> = {
    'select-station': 0,
    'select-vehicle': 1,
    scan: 2,
    confirm: 3,
}
