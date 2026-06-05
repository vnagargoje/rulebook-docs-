import { useNavigate } from 'react-router'
import { IconEye, IconPlus } from '@tabler/icons-react'
import { useMemo, useDeferredValue } from 'react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { Button } from '~/components/ui/button'
import { formatCurrency, formatDate } from '~/lib/formatter'
import { useSurrenders, type SurrenderListItem, type SurrenderListParams } from '~/queries/surrender'
import { useListingState } from '~/hooks'

export default function SurrendersListRoute() {
    const navigate = useNavigate()
    const { page, setPage, searchQuery, setSearchQuery } = useListingState()
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: SurrenderListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (deferredSearchQuery) {
            (params as any).search = deferredSearchQuery
        }

        return params
    }, [page, deferredSearchQuery])

    const { data, isLoading } = useSurrenders(queryParams)

    const surrenders = data?.data ?? []
    const meta = data?.meta

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Surrenders...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Vehicle Surrenders"
                    description="Handle vehicle returns, condition reports, and deposit closures."
                />
                <Button onClick={() => navigate('/surrender/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Process Return
                </Button>
            </div>

            <ResourceTable
                data={surrenders}
                emptyMessage="No surrenders found."
                searchPlaceholder="Search surrenders..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                totalItems={meta?.totalItems ?? surrenders.length}
                totalPages={meta?.totalPages ?? 1}
                currentPage={meta?.currentPage ?? page}
                onPageChange={setPage}
                columns={[
                    { header: 'Vehicle', cell: (s: SurrenderListItem) => s.vehicle?.vehicleNumber ?? s.vehicleId },
                    { header: 'Booking', cell: (s: SurrenderListItem) => s.bookingId },
                    { header: 'Penalty', cell: (s: SurrenderListItem) => formatCurrency(s.penalty) },
                    { header: 'Misc Charges', cell: (s: SurrenderListItem) => formatCurrency(s.miscCharges) },
                    { header: 'Refund Amount', cell: (s: SurrenderListItem) => formatCurrency(s.refundAmount) },
                    { header: 'Date', cell: (s: SurrenderListItem) => formatDate(s.createdAt) },
                    {
                        header: 'Actions',
                        cell: (s: SurrenderListItem) => (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/surrender/${s.bookingId}`)}>
                                <IconEye className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    )
}
