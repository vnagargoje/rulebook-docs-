import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Text, View } from '@/components/ui'
import type { CustomerProfileSectionCardProps } from '@/types/customer/customer-profile.types'

export function CustomerProfileSectionCard({ section }: CustomerProfileSectionCardProps) {
    return (
        <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
            <Text className='text-xs font-semibold uppercase tracking-[1.2px] text-primary-600'>
                {section.title}
            </Text>
            <View className='mt-4 gap-3'>
                {section.items.map((item) => (
                    <View
                        key={item.id}
                        className='flex-row items-start gap-3 rounded-2xl bg-neutral-50 p-4'>
                        <View className='mt-0.5 rounded-2xl bg-white p-2'>
                            <MaterialCommunityIcons
                                name={item.iconName}
                                size={18}
                                color='#2563EB'
                            />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-sm font-medium text-neutral-500'>{item.label}</Text>
                            <Text className='mt-1 text-base font-semibold text-neutral-900'>{item.value}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}
