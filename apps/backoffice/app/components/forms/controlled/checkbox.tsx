import { Checkbox } from '~/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { BaseFieldProps } from './types'

export function CheckboxField({
    control,
    name,
    label,
    disabled,
}: Omit<BaseFieldProps, 'placeholder'>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex flex-row items-center gap-3 rounded-xl border border-border/70 p-4'>
                    <FormControl>
                        <Checkbox
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                        />
                    </FormControl>
                    <div className='space-y-1'>
                        <FormLabel>{label}</FormLabel>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}
