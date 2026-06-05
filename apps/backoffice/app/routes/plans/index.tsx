import { useDeferredValue, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { usePlans } from '~/queries/plans'
import { formatCurrency } from '~/lib/formatter'
import { useListingState } from '~/hooks'

export default function PlansListRoute() {
    const navigate = useNavigate()
    const { page, setPage, searchQuery, setSearchQuery, filters, setFilters, resetFilters } = useListingState({
        initialFilters: { status: 'all' }
    })
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: Parameters<typeof usePlans>[0] = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (filters.status && filters.status !== 'all') {
            (params as any)['filter.active'] = [`$eq:${filters.status}`]
        }

        if (deferredSearchQuery) {
            params.search = deferredSearchQuery
        }
        return params
    }, [deferredSearchQuery, page])

    const { data, isLoading } = usePlans(queryParams)

    const plans = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo(() => [
        { header: 'Plan Name', accessor: 'name' as const },
        { header: 'Validity (Days)', accessor: 'validityDays' as const },
        { header: 'KM Limit', cell: (plan: (typeof plans)[number]) => `${plan.kmLimit} km` },
        { header: 'Price', cell: (plan: (typeof plans)[number]) => formatCurrency(plan.price) },
        { header: 'Deposit', cell: (plan: (typeof plans)[number]) => formatCurrency(plan.deposit) },
        { header: 'GST', cell: (plan: (typeof plans)[number]) => `${plan.gstPercentage}%` },
        { header: 'Total', cell: (plan: (typeof plans)[number]) => formatCurrency(plan.totalAmount) },
        { header: 'Status', cell: (plan: (typeof plans)[number]) => <StatusBadge status={plan.active ? 'ACTIVE' : 'INACTIVE'} /> },
        {
            header: 'Actions',
            cell: (plan: (typeof plans)[number]) => (
                <Button variant="ghost" size="icon" onClick={() => navigate(`/plans/edit/${plan.id}`)}>
                    <IconEdit className="h-4 w-4" />
                </Button>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Plans...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Subscription Plans"
                    description="Manage core subscription plans for customer vehicle leasing."
                />
                <Button onClick={() => navigate('/plans/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New Plan
                </Button>
            </div>

            <ResourceTable
                data={plans}
                emptyMessage="No plans found."
                searchPlaceholder="Search plans by name or description..."
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
                    },
                ] as any}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? plans.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
