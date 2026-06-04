import { useSearchParams } from 'react-router'
import { useCallback, useMemo } from 'react'

export interface UseListingStateOptions<TFilters extends Record<string, string>> {
    initialFilters?: TFilters
}

export function useListingState<TFilters extends Record<string, string> = Record<string, string>>(
    options?: UseListingStateOptions<TFilters>,
) {
    const [searchParams, setSearchParams] = useSearchParams()

    const page = Number(searchParams.get('page')) || 1
    const searchQuery = searchParams.get('search') || ''

    const filters = useMemo(() => {
        const result: Record<string, string> = { ...options?.initialFilters }
        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'search') {
                result[key] = value
            }
        })
        return result as TFilters
    }, [searchParams, options?.initialFilters])

    const setPage = useCallback(
        (newPage: number) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev)
                    next.set('page', String(newPage))
                    return next
                },
                { replace: true },
            )
        },
        [setSearchParams],
    )

    const setSearchQuery = useCallback(
        (newSearch: string) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev)
                    if (newSearch) {
                        next.set('search', newSearch)
                    } else {
                        next.delete('search')
                    }
                    next.set('page', '1') // Reset page on new search
                    return next
                },
                { replace: true },
            )
        },
        [setSearchParams],
    )

    const setFilters = useCallback(
        (newFilters: Record<string, string>) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev)
                    Object.entries(newFilters).forEach(([key, value]) => {
                        if (value && value !== 'all') {
                            next.set(key, value)
                        } else {
                            next.delete(key)
                        }
                    })
                    next.set('page', '1') // Reset page on new filters
                    return next
                },
                { replace: true },
            )
        },
        [setSearchParams],
    )

    const resetFilters = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev)
                next.delete('search')
                Object.keys(options?.initialFilters ?? {}).forEach(key => next.delete(key))
                
                // Remove all other keys except page? 
                // Or just delete all keys that match our filters.
                // It's safer to just clear all query params or known filters.
                const toDelete: string[] = []
                for (const key of next.keys()) {
                    if (key !== 'page') toDelete.push(key)
                }
                toDelete.forEach(key => next.delete(key))

                next.set('page', '1')
                return next
            },
            { replace: true }
        )
    }, [setSearchParams, options?.initialFilters])

    return {
        page,
        setPage,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        resetFilters,
    }
}
