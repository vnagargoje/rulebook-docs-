import type { Address } from '~/types/admin'

export function formatLabel(value: string) {
    return value
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value)
}

export function formatDate(value: string) {
    return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export function formatAddress(address: Address) {
    return [address.line1, address.line2, address.city, address.state, address.postalCode].filter(Boolean).join(', ')
}
