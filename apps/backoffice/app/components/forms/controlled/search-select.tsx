import * as React from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '~/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { BaseFieldProps, SelectOption } from './types'

type SearchSelectFieldProps = BaseFieldProps & {
    options: SelectOption[]
    searchPlaceholder?: string
    emptyMessage?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
    onLoadMore?: () => void
    hasMore?: boolean
    isLoadingOptions?: boolean
    isLoadingMore?: boolean
}

export function SearchSelectField({
    control,
    name,
    label,
    placeholder,
    disabled,
    options,
    searchPlaceholder,
    emptyMessage,
    searchValue,
    onSearchChange,
    onLoadMore,
    hasMore = false,
    isLoadingOptions = false,
    isLoadingMore = false,
}: SearchSelectFieldProps) {
    const [open, setOpen] = React.useState(false)
    const triggerPlaceholder = placeholder ?? `Select ${label}`
    const handleListScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
        if (!onLoadMore || !hasMore || isLoadingMore) {
            return
        }

        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
        const remainingScroll = scrollHeight - scrollTop - clientHeight

        if (remainingScroll <= 32) {
            onLoadMore()
        }
    }, [hasMore, isLoadingMore, onLoadMore])

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const selectedOption = options.find((option) => option.value === field.value)
                const hasValue = typeof field.value === 'string' && field.value.length > 0

                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        disabled={disabled}
                                        className={cn(
                                            'w-full justify-between font-normal',
                                            !selectedOption && 'text-muted-foreground',
                                        )}>
                                        <span className="truncate">
                                            {selectedOption?.label ?? triggerPlaceholder}
                                        </span>
                                        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder={searchPlaceholder ?? `Search ${label.toLowerCase()}...`}
                                        value={searchValue}
                                        onValueChange={onSearchChange}
                                    />
                                    <CommandList onScroll={handleListScroll}>
                                        <CommandEmpty>{emptyMessage ?? 'No results found.'}</CommandEmpty>
                                        {hasValue ? (
                                            <CommandItem
                                                value="__clear__"
                                                onSelect={() => {
                                                    field.onChange('')
                                                    setOpen(false)
                                                }}>
                                                Clear selection
                                            </CommandItem>
                                        ) : null}
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={`${option.label} ${option.value}`}
                                                onSelect={() => {
                                                    field.onChange(option.value)
                                                    setOpen(false)
                                                }}>
                                                <CheckIcon
                                                    className={cn(
                                                        'mr-2 size-4',
                                                        option.value === field.value ? 'opacity-100' : 'opacity-0',
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                        {isLoadingMore ? (
                                            <div className="px-2 py-2 text-sm text-muted-foreground">
                                                Loading more...
                                            </div>
                                        ) : null}
                                        {!isLoadingOptions && !isLoadingMore && hasMore ? (
                                            <div className="px-2 py-2 text-sm text-muted-foreground">
                                                Scroll to load more...
                                            </div>
                                        ) : null}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}
