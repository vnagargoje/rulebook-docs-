import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'
import { BaseFieldProps } from './types'

export function TextAreaField({
    control,
    name,
    label,
    placeholder,
    disabled,
    required,
}: BaseFieldProps) {
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
                        <Textarea
                            {...field}
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
