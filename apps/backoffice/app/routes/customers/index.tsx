import { useDeferredValue, useMemo } from 'react'
import { useNavigate } from 'react-router'


import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { useUsers, type UserItem } from '~/queries/users'
import { useListingState, useCustomerExport } from '~/hooks'
import { ExportDialog } from '~/components/ui/export-dialog'
import { useState } from 'react'

export default function UsersCustomerListRoute() {
    const navigate = useNavigate()
    const { page, setPage, searchQuery, setSearchQuery } = useListingState()
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useUsers>[0] = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
            'filter.roles.name': ['$eq:customer'],
        }

        if (deferredSearchQuery) {
            params.search = deferredSearchQuery
        }

        return params
    }, [deferredSearchQuery, page])

    const { data, isLoading } = useUsers(queryParams)

    const users = data?.data ?? []
    const paginationMeta = data?.meta

    const [exportModalOpen, setExportModalOpen] = useState(false)
    const { mutate, isPending } = useCustomerExport()

    const formatMobile = (mobile?: string) => {
        if (!mobile) {
            return 'N/A'
        }

        return /^91\d{10}$/.test(mobile) ? mobile.slice(2) : mobile
    }

    const columns = useMemo(() => [
        {
            header: 'Name',
            cell: (user: UserItem) => [user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A',
        },
        { header: 'Email', accessor: 'email' as const },
        {
            header: 'Mobile',
            cell: (user: UserItem) => formatMobile(user.mobilenumber),
        },
        {
            header: 'Role',
            cell: (user: UserItem) => (user.properties as { roleName?: string })?.roleName ?? 'N/A',
        },
    ], [navigate])

    if (isLoading) {
        return (
            <div className='p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase'>
                Loading Customers...
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Customers'
                description='Manage customer accounts across the platform.'
                actions={
                    <ExportDialog 
                        open={exportModalOpen} 
                        onOpenChange={setExportModalOpen}
                        title="Export Customers"
                        description="Download customer records as an Excel spreadsheet."
                        showDateFilter={true}
                        showStatusFilter={false}
                        isExporting={isPending}
                        onExport={(filters) => mutate(filters, { onSuccess: () => setExportModalOpen(false) })}
                    />
                }
            />

            <ResourceTable
                data={users}
                onRowClick={(item) => navigate(`/customers/${item.id}`)}
                emptyMessage='No customers found.'
                searchPlaceholder='Search customers by name, email, or mobile...'
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? users.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
