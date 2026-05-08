import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit, IconEye } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { Button } from '~/components/ui/button'
import { useUsers, type UserItem } from '~/queries/users'

export default function UsersCustomerListRoute() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
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

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const formatMobile = (mobile?: string) => {
        if (!mobile) {
            return '—'
        }

        return /^91\d{10}$/.test(mobile) ? mobile.slice(2) : mobile
    }

    const columns = useMemo(() => [
        {
            header: 'Name',
            cell: (user: UserItem) => [user.firstName, user.lastName].filter(Boolean).join(' ') || '—',
        },
        { header: 'Email', accessor: 'email' as const },
        {
            header: 'Mobile',
            cell: (user: UserItem) => formatMobile(user.mobilenumber),
        },
        {
            header: 'Role',
            cell: (user: UserItem) => (user.properties as { roleName?: string })?.roleName ?? '—',
        },
        {
            header: 'Actions',
            cell: (user: UserItem) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/${user.id}`)}>
                        <IconEye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/edit/${user.id}`)}>
                        <IconEdit className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Customers...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Customers"
                    description="Manage customer accounts across the platform."
                />
                <Button onClick={() => navigate('/customers/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New Customer
                </Button>
            </div>

            <ResourceTable
                data={users}
                emptyMessage="No customers found."
                searchPlaceholder="Search customers by name, email, or mobile..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? users.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
