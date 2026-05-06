import { useRef, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, LoaderIcon } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '~/components/ui/command'
import { cn } from '~/lib/utils'
import { BaseFieldProps, SelectOption } from './types'

interface SearchableSelectFieldProps extends BaseFieldProps {
    options: SelectOption[]
    required?: boolean
    onSearchChange?: (value: string) => void
    searchValue?: string
    isLoading?: boolean
    onLoadMore?: () => void
    hasNextPage?: boolean
}

export function SearchableSelectField({
    control,
    name,
    label,
    placeholder,
    disabled,
    options,
    required,
    onSearchChange,
    searchValue,
    isLoading,
    onLoadMore,
    hasNextPage,
}: SearchableSelectFieldProps) {
    const [open, setOpen] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const handleSentinelRef = (el: HTMLDivElement | null) => {
        ;(sentinelRef as any).current = el
        if (!el || !onLoadMore) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isLoading) {
                    onLoadMore()
                }
            },
            { threshold: 0.1 },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const selectedOption = options.find((o) => o.value === field.value)

                return (
                    <FormItem className="flex flex-col">
                        <FormLabel>
                            {label}
                            {required && <span className="text-destructive ml-0.5">*</span>}
                        </FormLabel>
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
                                            !field.value && 'text-muted-foreground',
                                        )}
                                    >
                                        <span className="truncate">
                                            {selectedOption?.label ?? placeholder ?? `Select ${label}`}
                                        </span>
                                        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                <Command
                                    shouldFilter={!onSearchChange}
                                >
                                    <CommandInput
                                        placeholder={`Search ${label.toLowerCase()}...`}
                                        value={searchValue}
                                        onValueChange={onSearchChange}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            {isLoading ? 'Loading…' : 'No results found.'}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {options.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    value={option.label}
                                                    onSelect={() => {
                                                        field.onChange(option.value)
                                                        setOpen(false)
                                                        if (onSearchChange) onSearchChange('')
                                                    }}
                                                >
                                                    {option.label}
                                                    <CheckIcon
                                                        className={cn(
                                                            'ml-auto size-4',
                                                            field.value === option.value ? 'opacity-100' : 'opacity-0',
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                            {onLoadMore && (
                                                <div ref={handleSentinelRef} className="py-1">
                                                    {isLoading && (
                                                        <div className="flex items-center justify-center py-2 text-xs text-muted-foreground gap-1.5">
                                                            <LoaderIcon className="size-3 animate-spin" />
                                                            Loading more…
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CommandGroup>
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
