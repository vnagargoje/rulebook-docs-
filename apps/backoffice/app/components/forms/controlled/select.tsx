import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { BaseFieldProps, SelectOption } from './types'

export function SelectField({
    control,
    name,
    label,
    placeholder,
    disabled,
    options,
    required,
}: BaseFieldProps & { options: SelectOption[]; required?: boolean }) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const selectValue = typeof field.value === 'string' && field.value.length > 0 ? field.value : undefined

                return (
                <FormItem>
                    <FormLabel>
                        {label}
                        {required && <span className="text-destructive ml-0.5">*</span>}
                    </FormLabel>
                    <Select
                        key={`${name}-${selectValue ?? 'empty'}`}
                        value={selectValue}
                        onValueChange={field.onChange}
                        disabled={disabled}>
                        <FormControl>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder={placeholder ?? `Select ${label}`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )
            }}
        />
    )
}
