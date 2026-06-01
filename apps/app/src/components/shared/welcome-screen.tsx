import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { MotiView } from 'moti'
import { assets } from '@/assets'
import colors from '@/components/ui/colors'

export function WelcomeScreen() {
    return (
        <View className='flex-1 items-center justify-center bg-white'>
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 800 }}
                className='items-center justify-center'
            >
                <Image
                    source={assets.Brand.Logo}
                    style={{ width: 150, height: 150 }}
                    contentFit='contain'
                />
                <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800, delay: 200 }}
                    className='mt-6'
                >
                    <Text className='font-inter text-2xl font-bold text-[#26313D] dark:text-white'>
                        Welcome to YugoRides
                    </Text>
                </MotiView>
                
                {/* Loader to indicate initialization is happening */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 800, delay: 600 }}
                    className='mt-8'
                >
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </MotiView>
            </MotiView>
        </View>
    )
}
