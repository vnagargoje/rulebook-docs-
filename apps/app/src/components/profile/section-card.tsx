import { Text, View } from '@/components/ui'

interface SectionCardProps {
    title: string
    children: React.ReactNode
}

export function SectionCard({ title, children }: SectionCardProps) {
    return (
        <View
            className='mx-4 mt-4 rounded-3xl bg-white p-5'
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
            <Text className='mb-4 text-[10px] font-bold uppercase tracking-[1.4px] text-neutral-400'>{title}</Text>
            {children}
        </View>
    )
}
