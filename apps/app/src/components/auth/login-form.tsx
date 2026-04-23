import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { loginContent } from '@/components/auth/auth.content'
import { Checkbox, Button, Input, Text, View } from '@/components/ui'
import { loginSchema } from '@/schema/auth/auth.schema'
import type { LoginFormProps, LoginFormValues } from '@/types/auth/login.types'

const defaultLoginSubmit = async () => {}

export function LoginForm({ isPending = false, onSubmit }: LoginFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phoneNumber: '',
            acceptTerms: false,
            marketingOptIn: false,
        },
    })

    return (
        <View>
            <Text
                testID='form-title'
                className='text-2xl font-bold text-neutral-900'>
                {loginContent.title}
            </Text>
            <Text className='mt-2 text-sm leading-6 text-neutral-500'>
                {loginContent.description}
            </Text>

            <Controller
                control={control}
                name='phoneNumber'
                render={({ field: { onBlur, onChange, value } }) => (
                    <Input
                        testID='phone-input'
                        label={loginContent.phoneLabel}
                        placeholder={loginContent.phonePlaceholder}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        error={errors.phoneNumber?.message}
                        keyboardType='phone-pad'
                        autoComplete='tel'
                    />
                )}
            />

            <View className='mb-6 mt-6'>
                <Controller
                    control={control}
                    name='acceptTerms'
                    render={({ field: { value, onChange } }) => (
                        <Checkbox.Root
                            checked={Boolean(value)}
                            onChange={onChange}
                            accessibilityLabel='Accept terms and privacy policy'
                            className='items-start'>
                            <View className='pt-0.5'>
                                <Checkbox.Icon checked={Boolean(value)} />
                            </View>
                            <Text className='ml-3 flex-1 text-sm leading-relaxed text-neutral-700'>
                                {loginContent.termsLabel}
                            </Text>
                        </Checkbox.Root>
                    )}
                />
                {errors.acceptTerms ? (
                    <Text className='ml-8 mt-2 text-sm text-danger-400'>{errors.acceptTerms.message}</Text>
                ) : null}
            </View>

            <Controller
                control={control}
                name='marketingOptIn'
                    render={({ field: { value, onChange } }) => (
                        <Checkbox.Root
                            checked={Boolean(value)}
                            onChange={onChange}
                            accessibilityLabel='Opt in for offers'
                            className='mb-8 items-start'>
                            <View className='pt-0.5'>
                                <Checkbox.Icon checked={Boolean(value)} />
                            </View>
                            <Text className='ml-3 flex-1 text-sm leading-relaxed text-neutral-700'>
                                {loginContent.marketingLabel}
                            </Text>
                        </Checkbox.Root>
                    )}
            />

            <Button
                testID='login-button'
                label={loginContent.submitLabel}
                onPress={handleSubmit(onSubmit ?? defaultLoginSubmit)}
                loading={isPending}
                className='mt-4'
                size='lg'
            />
        </View>
    )
}
