import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconBolt, IconEye, IconReceiptRupee, IconUser } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable, type ResourceTableColumn } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { useTransactions, type TransactionItem, type TransactionsListParams, type PlanSnapshot, type TopUpSnapshot } from '~/queries/transactions'
import { formatCurrency, formatDate } from '~/lib/formatter'
import { useListingState } from '~/hooks'

const PAYMENT_STATUS_OPTIONS = [
    { label: 'Awaiting', value: 'awaiting' },
    { label: 'Succeeded', value: 'succeeded' },
    { label: 'Failed', value: 'failed' },
    { label: 'Cancelled', value: 'cancelled' },
]

export default function TransactionsListRoute() {
    const navigate = useNavigate()
    const { page, setPage, filters, setFilters } = useListingState({ initialFilters: { status: 'all' } })
    const statusFilter = filters.status || 'all'

    const queryParams = useMemo<TransactionsListParams>(() => {
        const params: TransactionsListParams = {
            page,
            limit: 20,
            sortBy: ['createdAt:DESC'],
        }
        if (statusFilter !== 'all') {
            params['filter.status'] = [`$eq:${statusFilter}`]
        }
        return params
    }, [page, statusFilter])

    const { data } = useTransactions(queryParams)
    const transactions = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo<ResourceTableColumn<TransactionItem>[]>(() => [
        {
            header: 'Description',
            cell: (item) => {
                const isTopUp = !!item.userTopUpId
                const topUpSnap = item.userTopUp?.topUpSnapshot as unknown as TopUpSnapshot
                const planSnap = item.userPlan?.planSnapshot as PlanSnapshot
                const name = isTopUp ? (topUpSnap?.name ?? 'Top-Up') : (planSnap?.name ?? '—')
                const Icon = isTopUp ? IconBolt : IconReceiptRupee
                return (
                    <div className='flex items-center gap-3'>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isTopUp ? 'bg-amber-50 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                            <Icon size={16} />
                        </div>
                        <div>
                            <div className='flex items-center gap-2'>
                                <p className='text-sm font-semibold text-foreground'>{name}</p>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${isTopUp ? 'bg-amber-50 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                    {isTopUp ? 'Top-Up' : 'Plan'}
                                </span>
                            </div>
                            <p className='text-xs text-muted-foreground font-mono'>{item.id}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            header: 'Customer',
            cell: (item) => {
                const u = item.userPlan?.user
                const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ') || '—'
                return (
                    <div className='flex items-center gap-2'>
                        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <IconUser size={13} />
                        </div>
                        <div>
                            <p className='text-sm font-medium text-foreground'>{name}</p>
                            <p className='text-xs text-muted-foreground'>{u?.mobilenumber ?? u?.email ?? '—'}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            header: 'Amount',
            cell: (item) => (
                <span className='text-sm font-semibold'>
                    {formatCurrency(item.amount)}
                </span>
            ),
        },
        {
            header: 'Status',
            cell: (item) => (
                <StatusBadge status={item.status.toUpperCase()} />
            ),
        },
        {
            header: 'Time',
            cell: (item) => (
                <span className='text-xs text-muted-foreground'>
                    {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
            ),
        },
        {
            header: 'Date',
            cell: (item) => (
                <span className='text-xs text-muted-foreground'>{formatDate(item.createdAt)}</span>
            ),
        },
        {
            header: '',
            cell: (item) => (
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => navigate(`/transactions/${item.id}`)}
                    aria-label='View transaction'>
                    <IconEye className='h-4 w-4' />
                </Button>
            ),
        },
    ], [navigate])

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Transactions'
                description='Plan purchases and payment activity.'
            />
            <ResourceTable
                data={transactions}
                columns={columns}
                emptyMessage='No transactions found.'
                filterValues={{ status: statusFilter }}
                onFilterChange={setFilters}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? transactions.length}
                onPageChange={setPage}
                filterConfigs={[
                    {
                        field: 'status',
                        label: 'Status',
                        options: PAYMENT_STATUS_OPTIONS,
                    },
                ]}
            />
        </div>
    )
}
