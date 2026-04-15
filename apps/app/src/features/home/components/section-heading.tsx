import type { SectionHeadingProps } from './home-component.types'
import { Text, View } from '@/components/ui'

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
    return (
        <View className='gap-1'>
            {eyebrow ? (
                <Text className='text-xs font-semibold uppercase tracking-[1.6px] text-primary-600'>{eyebrow}</Text>
            ) : null}
            <Text className='text-[26px] font-bold leading-8 text-neutral-900 dark:text-neutral-50'>{title}</Text>
            {description ? (
                <Text className='text-sm leading-6 text-neutral-500 dark:text-neutral-400'>{description}</Text>
            ) : null}
        </View>
    )
}
