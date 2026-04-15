import { useState, useMemo, type ReactNode } from 'react'
import { IconChevronLeft, IconChevronRight, IconSearch, IconX } from '@tabler/icons-react'

import { Card, CardContent, CardFooter } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/lib/utils'

export interface FilterOption {
    label: string
    value: string
}

export interface FilterConfig<T> {
    field: keyof T
    label: string
    options: FilterOption[]
}

export interface ResourceTableColumn<T> {
    header: string
    cell?: (item: T) => ReactNode
    accessor?: keyof T
    className?: string
}

interface ResourceTableProps<T extends { id: string }> {
    data: T[]
    columns: ResourceTableColumn<T>[]
    activeId?: string
    onRowClick?: (item: T) => void
    emptyMessage: string
    pageSize?: number
    className?: string
    searchPlaceholder?: string
    searchFields?: (keyof T)[]
    filterConfigs?: FilterConfig<T>[]
}

export function ResourceTable<T extends { id: string }>({
    data,
    columns,
    activeId,
    onRowClick,
    emptyMessage,
    pageSize = 10,
    className,
    searchPlaceholder = "Search records...",
    searchFields,
    filterConfigs = []
}: ResourceTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

    const filteredData = useMemo(() => {
        let result = data

        if (searchQuery && searchFields) {
            const query = searchQuery.toLowerCase()
            result = result.filter((item) => {
                return searchFields.some((field) => {
                    const value = item[field]
                    if (typeof value === 'string') return value.toLowerCase().includes(query)
                    if (typeof value === 'number') return value.toString().includes(query)
                    return false
                })
            })
        }

        Object.entries(activeFilters).forEach(([field, value]) => {
            if (value && value !== 'all') {
                result = result.filter((item) => {
                    const itemValue = item[field as keyof T]
                    return String(itemValue) === value
                })
            }
        })

        return result
    }, [data, searchQuery, searchFields, activeFilters])

    const totalPages = Math.ceil(filteredData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    const resetFilters = () => {
        setSearchQuery('')
        setActiveFilters({})
        setCurrentPage(1)
    }

    const hasActiveFilters = searchQuery !== '' || Object.values(activeFilters).some(v => v !== 'all')

    return (
        <Card className={cn('gap-0 flex flex-col overflow-hidden border-slate-200 shadow-sm', className)}>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-white border-b">
                <div className="flex-1 flex flex-col md:flex-row items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10 h-10 border-slate-200 focus:border-primary focus:ring-primary/10 transition-all rounded-xl text-sm"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {filterConfigs.map((config) => (
                            <Select
                                key={String(config.field)}
                                value={activeFilters[String(config.field)] || 'all'}
                                onValueChange={(val) => {
                                    setActiveFilters(prev => ({ ...prev, [String(config.field)]: val }))
                                    setCurrentPage(1)
                                }}
                            >
                                <SelectTrigger className="h-10 w-[140px] rounded-xl border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 focus:ring-primary/10">
                                    <SelectValue placeholder={config.label} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200">
                                    <SelectItem value="all" className="text-xs font-bold uppercase tracking-wider text-slate-400">All {config.label}s</SelectItem>
                                    {config.options.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium">
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ))}

                        {hasActiveFilters && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={resetFilters}
                                className="h-9 gap-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                            >
                                <IconX size={14} /> Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <CardContent className='p-0 flex-1 overflow-auto bg-white'>
                {filteredData.length ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b bg-slate-100/60 transition-colors">
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.header}
                                        className={cn(
                                            "h-12 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500", 
                                            column.className
                                        )}>
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className={cn(
                                        "group border-b last:border-0 transition-all duration-200",
                                        onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50/30',
                                        item.id === activeId ? 'bg-primary/5 border-l-2 border-l-primary' : '',
                                    )}
                                    onClick={() => onRowClick?.(item)}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.header}
                                            className={cn("py-4 text-sm font-medium text-slate-700", column.className)}>
                                            {column.cell
                                                ? column.cell(item)
                                                : column.accessor
                                                ? (item[column.accessor] as ReactNode)
                                                : null}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className='flex flex-col items-center justify-center px-6 py-20 text-center animate-in fade-in slide-in-from-bottom-2 duration-500'>
                        <div className="h-16 w-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-6 shadow-inner">
                            <IconSearch size={32} />
                        </div>
                        <p className='text-base font-bold text-slate-900'>{emptyMessage}</p>
                        <p className="text-sm text-slate-400 mt-2 max-w-[280px]">We couldn't find any results matching your current criteria.</p>
                        {hasActiveFilters && (
                            <Button 
                                variant="default" 
                                size="sm" 
                                className="mt-8 bg-primary rounded-xl px-6 font-bold shadow-lg shadow-primary/20"
                                onClick={resetFilters}
                            >
                                Reset Search
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
            
            {filteredData.length > 0 && (
                <CardFooter className='flex items-center justify-between border-t py-6 px-8 bg-slate-50/40'>
                    <div className='text-xs font-semibold text-slate-500'>
                        Showing <span className='text-slate-900 font-bold'>{startIndex + 1}</span> - <span className='text-slate-900 font-bold'>{Math.min(startIndex + pageSize, filteredData.length)}</span> of <span className='text-slate-900 font-bold'>{filteredData.length}</span> entries
                    </div>
                    
                    <div className='flex items-center gap-3'>
                        <Button
                            variant='outline'
                            size='sm'
                            className='h-9 w-9 p-0 border-slate-200 rounded-xl hover:bg-primary hover:text-white transition-all'
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            <IconChevronLeft size={18} />
                        </Button>
                        
                        <div className='flex items-center gap-2'>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                                })
                                .map((page, index, array) => {
                                    const showEllipsis = index > 0 && page - array[index - 1] > 1
                                    
                                    return (
                                        <div key={page} className="flex items-center gap-2">
                                            {showEllipsis && <span className="text-slate-300 font-bold">...</span>}
                                            <Button
                                                variant={currentPage === page ? 'default' : 'ghost'}
                                                size='sm'
                                                className={cn(
                                                    'h-9 min-w-[36px] px-2 text-xs font-bold rounded-xl transition-all',
                                                    currentPage === page 
                                                        ? 'shadow-lg shadow-primary/25 bg-primary' 
                                                        : 'hover:bg-primary/5 hover:text-primary text-slate-500'
                                                )}
                                                onClick={() => goToPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        </div>
                                    )
                                })}
                        </div>

                        <Button
                            variant='outline'
                            size='sm'
                            className='h-9 w-9 p-0 border-slate-200 rounded-xl hover:bg-primary hover:text-white transition-all'
                            disabled={currentPage === totalPages}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            <IconChevronRight size={18} />
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}
