/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { PressableProps, View } from 'react-native'
import type { VariantProps } from 'tailwind-variants'
import * as React from 'react'
import { ActivityIndicator, Pressable, Text } from 'react-native'
import { tv } from 'tailwind-variants'

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const button = tv({
    slots: {
        container: 'my-2 flex flex-row items-center justify-center rounded-md px-4',
        label: 'font-inter text-base font-semibold',
        indicator: 'h-6 text-white',
    },

    variants: {
        variant: {
            default: {
                container: 'bg-primary-600',
                label: 'text-white',
                indicator: 'text-white',
            },
            secondary: {
                container: 'bg-warning-100',
                label: 'text-warning-700',
                indicator: 'text-warning-700',
            },
            outline: {
                container: 'border border-primary-200 bg-white dark:border-primary-800 dark:bg-neutral-900',
                label: 'text-primary-700 dark:text-primary-300',
                indicator: 'text-primary-700 dark:text-primary-300',
            },
            destructive: {
                container: 'bg-red-600',
                label: 'text-white',
                indicator: 'text-white',
            },
            ghost: {
                container: 'bg-transparent',
                label: 'text-black underline dark:text-white',
                indicator: 'text-black dark:text-white',
            },
            link: {
                container: 'bg-transparent',
                label: 'text-black',
                indicator: 'text-black',
            },
        },
        size: {
            default: {
                container: 'h-10 px-4',
                label: 'text-base',
            },
            lg: {
                container: 'h-12 px-8',
                label: 'text-xl',
            },
            sm: {
                container: 'h-8 px-3',
                label: 'text-sm',
                indicator: 'h-2',
            },
            icon: { container: 'size-9' },
        },
        disabled: {
            true: {
                container: 'bg-neutral-300 dark:bg-neutral-300',
                label: 'text-neutral-600 dark:text-neutral-600',
                indicator: 'text-neutral-400 dark:text-neutral-400',
            },
        },
        fullWidth: {
            true: {
                container: '',
            },
            false: {
                container: 'self-center',
            },
        },
    },
    defaultVariants: {
        variant: 'default',
        disabled: false,
        fullWidth: true,
        size: 'default',
    },
})

type ButtonVariants = VariantProps<typeof button>
type Props = {
    label?: string
    loading?: boolean
    className?: string
    textClassName?: string
} & ButtonVariants &
    Omit<PressableProps, 'disabled'>

export function Button({
    ref,
    label: text,
    loading = false,
    variant = 'default',
    disabled = false,
    size = 'default',
    className = '',
    testID,
    textClassName = '',
    ...props
}: Props & { ref?: React.RefObject<View | null> }) {
    const styles = React.useMemo(() => button({ variant, disabled, size }), [variant, disabled, size])

    const scale = useSharedValue(1)
    
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        }
    })

    const handlePressIn = React.useCallback((e: any) => {
        scale.value = withTiming(0.97, { duration: 100 })
        if (props.onPressIn) props.onPressIn(e)
    }, [scale, props.onPressIn])

    const handlePressOut = React.useCallback((e: any) => {
        scale.value = withTiming(1, { duration: 100 })
        if (props.onPressOut) props.onPressOut(e)
    }, [scale, props.onPressOut])

    return (
        <AnimatedPressable
            disabled={disabled || loading}
            className={styles.container({ className })}
            style={[animatedStyle, props.style as any]}
            {...props}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            ref={ref as any}
            testID={testID}>
            {props.children ? (
                props.children
            ) : (
                <>
                    {loading ? (
                        <ActivityIndicator
                            size='small'
                            className={styles.indicator()}
                            testID={testID ? `${testID}-activity-indicator` : undefined}
                        />
                    ) : (
                        <Text
                            testID={testID ? `${testID}-label` : undefined}
                            className={styles.label({ className: textClassName })}>
                            {text}
                        </Text>
                    )}
                </>
            )}
        </AnimatedPressable>
    )
}
