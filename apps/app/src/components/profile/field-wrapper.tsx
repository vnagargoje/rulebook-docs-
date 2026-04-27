import { Text, View } from '@/components/ui'

interface FieldWrapperProps {
    label: string
    required?: boolean
    error?: string
    last?: boolean
    children: React.ReactNode
}

export function FieldWrapper({ label, required, error, last, children }: FieldWrapperProps) {
    return (
        <View className={last ? '' : 'mb-4'}>
            <View className='mb-1.5 flex-row items-center gap-1'>
                <Text className='text-[13px] font-semibold text-neutral-700'>{label}</Text>
                {required && <Text className='text-[11px] font-bold text-red-500'>*</Text>}
            </View>
            {children}
            {error ? <Text className='mt-1 text-xs text-red-500'>{error}</Text> : null}
        </View>
    )
}
