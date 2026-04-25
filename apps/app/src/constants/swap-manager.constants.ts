export const SM_OUTWARD_STEP_LABELS = ['Destination', 'Vehicle', 'Scan', 'Confirm'] as const
export const SM_OUTWARD_STEP_INDEX: Record<string, number> = {
    'select-hub': 0,
    'select-vehicle': 1,
    scan: 2,
    confirm: 3,
}

export const SM_INWARD_STEP_LABELS = ['Select Shipment', 'Scan Batteries', 'Confirm'] as const
export const SM_INWARD_STEP_INDEX: Record<string, number> = {
    'select-movement': 0,
    scan: 1,
    confirm: 2,
}
