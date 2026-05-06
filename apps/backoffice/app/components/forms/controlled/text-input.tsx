import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { BaseFieldProps } from './types'

interface TextInputFieldProps extends BaseFieldProps {
    type?: 'text' | 'email' | 'tel' | 'date' | 'number'
    maxLength?: number
    onlyDigits?: boolean
}

export function TextInputField({
    control,
    name,
    label,
    placeholder,
    type = 'text',
    disabled,
    required,
    maxLength,
    onlyDigits,
}: TextInputFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                        {required && <span className="text-destructive ml-0.5">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type={type}
                            value={field.value ?? ''}
                            placeholder={placeholder}
                            disabled={disabled}
                            maxLength={maxLength}
                            inputMode={onlyDigits ? 'numeric' : undefined}
                            onKeyDown={onlyDigits ? (e) => {
                                const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
                                if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                                    e.preventDefault()
                                }
                            } : undefined}
                            onChange={onlyDigits ? (e) => {
                                const digits = e.target.value.replace(/\D/g, '')
                                const capped = maxLength ? digits.slice(0, maxLength) : digits
                                field.onChange(capped)
                            } : field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
