export function toSafeNumber(value: number | string | null | undefined) {
    const numericValue = Number(value)
    return Number.isFinite(numericValue) ? numericValue : 0
}

export function formatNumberIN(value: number | string | null | undefined) {
    return toSafeNumber(value).toLocaleString('en-IN')
}

export function formatCurrencyIN(value: number | string | null | undefined) {
    return `₹${formatNumberIN(value)}`
}

export function formatDateIN(
    value: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
) {
    return new Date(value).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options,
    })
}

export function formatTimeIN(
    value: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
) {
    return new Date(value).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    })
}

export function formatKmIN(value: number | string | null | undefined) {
    return `${formatNumberIN(value)} km`
}

export function formatGender(g?: string | null): string | null {
    if (!g) return null
    return g.charAt(0).toUpperCase() + g.slice(1)
}

export function buildAddressLine(addr: {
    lineOne: string
    lineTwo?: string | null
    pincode: string
    city?: { name: string; state?: { name: string } }
}): string {
    return [addr.lineOne, addr.lineTwo, addr.city?.name, addr.city?.state?.name, addr.pincode]
        .filter(Boolean)
        .join(', ')
}
