import { Text, View } from '@/components/ui'
import { formatCurrencyIN } from '@/lib/formatters/customer'

type Props = {
    label: string
    amount: number
    highlight?: boolean
}

export function PriceRow({ label, amount, highlight }: Props) {
    return (
        <View className='flex-row items-center justify-between py-3.5'>
            <Text className={`text-sm ${highlight ? 'font-bold text-neutral-900' : 'text-neutral-600'}`}>
                {label}
            </Text>
            <Text
                className={`${highlight ? 'text-xl font-bold text-primary-600' : 'text-sm font-semibold text-neutral-900'}`}>
                {formatCurrencyIN(amount)}
            </Text>
        </View>
    )
}
