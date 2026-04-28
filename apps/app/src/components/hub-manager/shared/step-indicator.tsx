import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Text, View } from '@/components/ui'

interface StepIndicatorProps {
    steps: string[]
    currentStepIndex: number
}

export function StepIndicator({ steps, currentStepIndex }: StepIndicatorProps) {
    return (
        <View className='flex-row items-center bg-white px-6 pb-4 pt-2'>
            {steps.map((label, index) => (
                <View
                    key={label}
                    className='flex-1 items-center'>
                    <View className='flex-row items-center w-full'>
                        <View
                            className={`h-0.5 flex-1 ${index === 0 ? 'bg-transparent' : currentStepIndex >= index ? 'bg-primary-500' : 'bg-neutral-200'}`}
                        />
                        <View
                            className={`h-6 w-6 items-center justify-center rounded-full ${currentStepIndex >= index ? 'bg-primary-500' : 'bg-neutral-200'}`}>
                            {currentStepIndex > index ? (
                                <MaterialCommunityIcons
                                    name='check'
                                    size={12}
                                    color='white'
                                />
                            ) : (
                                <Text
                                    className={`text-[10px] font-bold ${currentStepIndex >= index ? 'text-white' : 'text-neutral-500'}`}>
                                    {index + 1}
                                </Text>
                            )}
                        </View>
                        <View
                            className={`h-0.5 flex-1 ${index === steps.length - 1 ? 'bg-transparent' : currentStepIndex > index ? 'bg-primary-500' : 'bg-neutral-200'}`}
                        />
                    </View>
                    <Text
                        className={`mt-1 text-[10px] font-semibold ${currentStepIndex >= index ? 'text-primary-600' : 'text-neutral-400'}`}>
                        {label}
                    </Text>
                </View>
            ))}
        </View>
    )
}
