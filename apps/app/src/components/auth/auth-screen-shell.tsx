import { FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import type { AuthScreenShellProps } from '@/types/auth/auth.types'

export function AuthScreenShell({ eyebrow, title, description, children }: AuthScreenShellProps) {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-white'>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='flex-1 bg-white'>
                        <View className='overflow-hidden bg-[#0F172A] px-6 pb-10 pt-8'>
                            <View className='absolute -right-10 -top-8 h-40 w-40 rounded-full bg-primary-500/20' />
                            <View className='absolute bottom-[-72px] left-[-20px] h-36 w-36 rounded-full bg-warning-400/20' />
                            <Text className='text-xs font-semibold uppercase tracking-[1.8px] text-[#8EA0BE]'>
                                {eyebrow}
                            </Text>
                            <Text className='mt-3 text-3xl font-bold leading-tight text-white'>{title}</Text>
                            <Text className='mt-3 text-sm leading-6 text-[#CBD5E1]'>{description}</Text>
                        </View>
                        <View className='flex-1 px-6 pb-10 pt-8'>{children}</View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
