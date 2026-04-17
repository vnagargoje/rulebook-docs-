import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { MultiSelect } from '~/components/ui/multi-select'
import { BaseFieldProps, SelectOption } from './types'

export function MultiSelectField({
    control,
    name,
    label,
    placeholder,
    disabled,
    options,
}: BaseFieldProps & { options: SelectOption[] }) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <MultiSelect
                            options={options}
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? []}
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
