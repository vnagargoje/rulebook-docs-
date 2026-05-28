import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { otpContent } from '@/components/auth/auth.content'
import { Button, Input, Text, View } from '@/components/ui'
import { otpSchema } from '@/schema/auth/auth.schema'
import type { OTPFormProps, OTPFormValues } from '@/types/auth/otp.types'
import { normalizeOtpCode } from './auth.utils'
import { useOtpTimer } from '@/hooks/use-otp-timer'

const defaultOTPSubmit = async () => {}

export function OTPForm({ phone, isPending = false, onSubmit }: OTPFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<OTPFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            code: '',
        },
    })

    const description = phone
        ? `Enter the 4-digit code sent to ${phone}.`
        : otpContent.fallbackDescription

    const { timeLeft, canResend, handleResend, isResending } = useOtpTimer(60, phone || '')

    return (
        <View>
            <Text className='text-2xl font-bold text-neutral-900'>{otpContent.title}</Text>
            <Text className='mt-2 text-sm leading-6 text-neutral-500'>{description}</Text>

            <View className='mb-8'>
                <Controller
                    control={control}
                    name='code'
                    render={({ field: { onBlur, onChange, value } }) => (
                        <Input
                            testID='otp-input'
                            label={otpContent.codeLabel}
                            placeholder={otpContent.codePlaceholder}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={(nextValue) => onChange(normalizeOtpCode(nextValue))}
                            error={errors.code?.message}
                            keyboardType='number-pad'
                            maxLength={4}
                            textAlign='center'
                            autoComplete='one-time-code'
                        />
                    )}
                />
            </View>

            <Button
                testID='otp-button'
                label={otpContent.submitLabel}
                onPress={handleSubmit(onSubmit ?? defaultOTPSubmit)}
                loading={isPending}
                className='mt-8'
                size='lg'
            />

            <View className='mt-8 flex-row justify-center items-center'>
                <Text className='text-center text-sm leading-relaxed text-neutral-500'>
                    {canResend ? "Didn't receive code? " : `Resend code in 00:${timeLeft.toString().padStart(2, '0')}`}
                </Text>
                {canResend && (
                    <Text
                        onPress={handleResend}
                        disabled={isResending}
                        className={`text-sm font-medium underline ml-1 ${isResending ? 'text-neutral-400' : 'text-primary-600'}`}>
                        {isResending ? 'Resending...' : 'Resend OTP'}
                    </Text>
                )}
            </View>
        </View>
    )
}
