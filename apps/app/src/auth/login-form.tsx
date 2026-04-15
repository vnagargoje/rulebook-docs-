import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import type { LoginFormProps } from './login.types'
import { loginContent } from './login.data'
import { loginSchema } from './login.schema'
import type { LoginSchemaValues } from './login.schema'
import { Button, Input, Text, View } from '@/components/ui'

const defaultLoginSubmit = () => {}

export function LoginForm({ isPending = false, onSubmit }: LoginFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            keyboardVerticalOffset={10}>
            <View className='flex-1 justify-center p-4'>
                <View className='items-center justify-center'>
                    <Text
                        testID='form-title'
                        className='pb-6 text-center text-4xl font-bold'>
                        {loginContent.title}
                    </Text>
                    <Text className='mb-6 max-w-xs text-center text-gray-500'>{loginContent.description}</Text>
                </View>

                <Controller
                    control={control}
                    name='email'
                    render={({ field: { onBlur, onChange, value } }) => (
                        <Input
                            testID='email-input'
                            label={loginContent.emailLabel}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={errors.email?.message}
                            autoCapitalize='none'
                            keyboardType='email-address'
                        />
                    )}
                />

                <Controller
                    control={control}
                    name='password'
                    render={({ field: { onBlur, onChange, value } }) => (
                        <Input
                            testID='password-input'
                            label={loginContent.passwordLabel}
                            placeholder={loginContent.passwordPlaceholder}
                            secureTextEntry
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={errors.password?.message}
                        />
                    )}
                />

                <Button
                    testID='login-button'
                    label={loginContent.submitLabel}
                    onPress={handleSubmit(onSubmit ?? defaultLoginSubmit)}
                    loading={isPending}
                />
            </View>
        </KeyboardAvoidingView>
    )
}
