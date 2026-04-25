import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'

import { Text, View } from '@/components/ui'

interface StepIndicatorProps {
    currentStep: number
}

const STEPS = [
    { id: 1, label: 'Scan Plan' },
    { id: 2, label: 'Inward' },
    { id: 3, label: 'Outward' },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <View className='flex-row items-center justify-between px-10 py-6 bg-white border-b border-neutral-100'>
            {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id
                const isActive = currentStep === step.id

                return (
                    <React.Fragment key={step.id}>
                        <View className='items-center'>
                            <View
                                className={`h-8 w-8 rounded-full items-center justify-center border-2 ${
                                    isCompleted
                                        ? 'bg-primary-500 border-primary-500'
                                        : isActive
                                        ? 'bg-white border-primary-500'
                                        : 'bg-white border-neutral-200'
                                }`}>
                                {isCompleted ? (
                                    <MaterialCommunityIcons
                                        name='check'
                                        size={16}
                                        color='white'
                                    />
                                ) : (
                                    <Text
                                        className={`text-xs font-bold ${
                                            isActive ? 'text-primary-600' : 'text-neutral-400'
                                        }`}>
                                        {step.id}
                                    </Text>
                                )}
                            </View>
                            <Text
                                className={`mt-1.5 text-[10px] font-bold uppercase tracking-wider ${
                                    isActive ? 'text-primary-600' : 'text-neutral-400'
                                }`}>
                                {step.label}
                            </Text>
                        </View>
                        {index < STEPS.length - 1 && (
                            <View className='flex-1 h-[2px] bg-neutral-100 mx-2 -mt-4'>
                                <View
                                    className={`h-full bg-primary-500`}
                                    style={{ width: isCompleted ? '100%' : '0%' }}
                                />
                            </View>
                        )}
                    </React.Fragment>
                )
            })}
        </View>
    )
}
