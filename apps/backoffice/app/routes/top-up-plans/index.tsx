import { useDeferredValue, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { useTopUps } from '~/queries/top-ups'
import { formatCurrency } from '~/lib/formatter'
import { useListingState } from '~/hooks'

export default function TopUpPlansListRoute() {
    const navigate = useNavigate()
    const { page, setPage, searchQuery, setSearchQuery, filters, setFilters, resetFilters } = useListingState({
        initialFilters: { status: 'all' }
    })
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useTopUps>[0] = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (filters.status && filters.status !== 'all') {
            params['filter.active'] = [`$eq:${filters.status}`]
        }

        if (deferredSearchQuery) {
            params.search = deferredSearchQuery
        }
        return params
    }, [deferredSearchQuery, page])

    const { data, isLoading } = useTopUps(queryParams)

    const topUps = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo(() => [
        { header: 'Plan Name', accessor: 'name' as const },
        { header: 'KM Limit', cell: (topUp: (typeof topUps)[number]) => `${topUp.kmLimit} km` },
        { header: 'Price', cell: (topUp: (typeof topUps)[number]) => formatCurrency(topUp.price) },
        { header: 'GST', cell: (topUp: (typeof topUps)[number]) => `${topUp.gstPercentage}%` },
        { header: 'Total', cell: (topUp: (typeof topUps)[number]) => formatCurrency(topUp.totalAmount) },
        { header: 'Status', cell: (topUp: (typeof topUps)[number]) => <StatusBadge status={topUp.active ? 'ACTIVE' : 'INACTIVE'} /> },
        {
            header: 'Actions',
            cell: (topUp: (typeof topUps)[number]) => (
                <Button variant="ghost" size="icon" onClick={() => navigate(`/top-up-plans/edit/${topUp.id}`)}>
                    <IconEdit className="h-4 w-4" />
                </Button>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Top-Up Plans...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Top-Up Plans"
                    description="Manage additional usage packages for active subscriptions."
                />
                <Button onClick={() => navigate('/top-up-plans/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New Top-Up
                </Button>
            </div>

            <ResourceTable
                data={topUps}
                emptyMessage="No top-up plans found."
                searchPlaceholder="Search top-ups by name or description..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filterValues={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
                filterConfigs={[
                    {
                        field: 'active',
                        label: 'Status',
                        options: [
                            { label: 'Active', value: 'true' },
                            { label: 'Inactive', value: 'false' },
                        ]
                    }
                ] as any}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? topUps.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
