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
    isLoading,
    onLoadMore,
    hasNextPage,
}: BaseFieldProps & { 
    options: SelectOption[]
    isLoading?: boolean
    onLoadMore?: () => void
    hasNextPage?: boolean
}) {
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
                            isLoading={isLoading}
                            onLoadMore={onLoadMore}
                            hasNextPage={hasNextPage}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
