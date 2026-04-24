import { Text, View } from '@/components/ui'

type Props = {
    label: string
    value: string
    bold?: boolean
}

export function SummaryRow({ label, value, bold }: Props) {
    return (
        <View className='flex-row items-center justify-between py-3.5'>
            <Text className={`text-sm ${bold ? 'font-bold text-neutral-900' : 'text-neutral-600'}`}>
                {label}
            </Text>
            <Text
                className={`${bold ? 'text-xl font-bold text-primary-600' : 'text-sm font-semibold text-neutral-900'}`}>
                {value}
            </Text>
        </View>
    )
}
