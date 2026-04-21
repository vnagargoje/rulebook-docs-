import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { Button } from '~/components/ui/button'
import { useUsers, type UserItem } from '~/queries/users'

export default function UsersListRoute() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [roleFilter, setRoleFilter] = useState('all')
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useUsers>[0] = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (deferredSearchQuery) {
            params.search = deferredSearchQuery
        }

        if (roleFilter !== 'all') {
            params['filter.roles.name'] = [roleFilter]
        }

        return params
    }, [deferredSearchQuery, page, roleFilter])

    const { data, isLoading } = useUsers(queryParams)

    const users = data?.data ?? []
    const paginationMeta = data?.meta

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setRoleFilter(filters.roles || 'all')
        setPage(1)
    }, [])

    const columns = useMemo(() => [
        {
            header: 'Name',
            cell: (user: UserItem) => [user.firstName, user.lastName].filter(Boolean).join(' ') || '—',
        },
        { header: 'Email', accessor: 'email' as const },
        { header: 'Mobile', accessor: 'mobilenumber' as const },
        {
            header: 'Role',
            cell: (user: UserItem) => (user.properties as { roleName?: string })?.roleName ?? '—',
        },
        {
            header: 'Actions',
            cell: (user: UserItem) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/users/edit/${user.id}`)}>
                        <IconEdit className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Users...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="User Management"
                    description="Manage platform users, employees, and their assignments."
                />
                <Button onClick={() => navigate('/users/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New User
                </Button>
            </div>

            <ResourceTable
                data={users}
                emptyMessage="No users found."
                searchPlaceholder="Search users by name, email, or mobile..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                filterValues={{ roles: roleFilter }}
                onFilterChange={handleFilterChange}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? users.length}
                onPageChange={setPage}
                filterConfigs={[
                    {
                        field: 'roles',
                        label: 'Role',
                        options: [
                            { label: 'Customer', value: 'customer' },
                            { label: 'Swap Manager', value: 'swap_manager' },
                            { label: 'Hub Manager', value: 'hub_manager' },
                            { label: 'System Admin', value: 'system_admin' },
                        ],
                    },
                ]}
                columns={columns}
            />
        </div>
    )
}
