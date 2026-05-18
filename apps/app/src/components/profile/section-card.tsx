import { Text, View } from '@/components/ui'

interface SectionCardProps {
    title: string
    action?: React.ReactNode
    children: React.ReactNode
}

export function SectionCard({ title, action, children }: SectionCardProps) {
    return (
        <View
            className='mx-4 mt-4 rounded-3xl bg-white p-5'
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
            <View className='mb-4 flex-row items-center justify-between'>
                <Text className='text-[10px] font-bold uppercase tracking-[1.4px] text-neutral-400'>{title}</Text>
                {action ?? null}
            </View>
            {children}
        </View>
    )
}
