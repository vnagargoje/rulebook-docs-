import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { BaseFieldProps } from './types'

interface TextInputFieldProps extends BaseFieldProps {
    type?: 'text' | 'email' | 'tel' | 'date' | 'number'
}

export function TextInputField({
    control,
    name,
    label,
    placeholder,
    type = 'text',
    disabled,
}: TextInputFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type={type}
                            value={field.value ?? ''}
                            placeholder={placeholder}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
