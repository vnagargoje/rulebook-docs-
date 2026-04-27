import { Text, View } from '@/components/ui'

type StatTileTint = 'primary' | 'success' | 'warning' | 'neutral'

type Props = {
    label: string
    value: string
    tint?: StatTileTint
}

const TINT_STYLES: Record<StatTileTint, { container: string; label: string; value: string }> = {
    primary: {
        container: 'border-primary-100 bg-primary-50',
        label: 'text-primary-500',
        value: 'text-primary-800',
    },
    success: {
        container: 'border-success-100 bg-success-50',
        label: 'text-success-600',
        value: 'text-success-800',
    },
    warning: {
        container: 'border-warning-100 bg-warning-50',
        label: 'text-warning-600',
        value: 'text-warning-800',
    },
    neutral: {
        container: 'border-neutral-100 bg-neutral-50',
        label: 'text-neutral-400',
        value: 'text-neutral-900',
    },
}

export function StatTile({ label, value, tint = 'neutral' }: Props) {
    const styles = TINT_STYLES[tint]

    return (
        <View className={`flex-1 rounded-2xl border p-3 ${styles.container}`}>
            <Text className={`text-[10px] font-semibold uppercase tracking-[1px] ${styles.label}`}>
                {label}
            </Text>
            <Text className={`mt-1 text-sm font-bold ${styles.value}`}>{value}</Text>
        </View>
    )
}
