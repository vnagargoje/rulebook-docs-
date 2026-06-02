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
                    prev.set('page', String(newPage))
                    return prev
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
                    if (newSearch) {
                        prev.set('search', newSearch)
                    } else {
                        prev.delete('search')
                    }
                    prev.set('page', '1') // Reset page on new search
                    return prev
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
                    Object.entries(newFilters).forEach(([key, value]) => {
                        if (value && value !== 'all') {
                            prev.set(key, value)
                        } else {
                            prev.delete(key)
                        }
                    })
                    prev.set('page', '1') // Reset page on new filters
                    return prev
                },
                { replace: true },
            )
        },
        [setSearchParams],
    )

    return {
        page,
        setPage,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
    }
}
