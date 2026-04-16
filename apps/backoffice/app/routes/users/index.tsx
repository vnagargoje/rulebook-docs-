import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit, IconUserX } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { mockApi } from '~/services/mockApi'
import { type User } from '~/types/admin'
import { toast } from 'sonner'

export default function UsersListRoute() {
    const navigate = useNavigate()
    const [users, setUsers] = useState<User[]>([])

    const loadUsers = useCallback(async () => {
        try {
            const data = await mockApi.listUsers()
            setUsers(data)
        } catch (error) {
            toast.error('Failed to load users')
        }
    }, [])

    useEffect(() => {
        void loadUsers()
    }, [loadUsers])

    const onDisable = async (id: string) => {
        if (!confirm('Are you sure you want to disable this user?')) return
        try {
            await mockApi.disableUser(id)
            toast.success('User disabled successfully')
            void loadUsers()
        } catch (error) {
            toast.error('Failed to disable user')
        }
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
                title="All Users"
                data={users}
                emptyMessage="No users found."
                columns={[
                    { header: 'Name', accessor: 'name' },
                    { header: 'Email', accessor: 'email' },
                    { header: 'Role', cell: (user) => user.role.replace(/_/g, ' ') },
                    { header: 'Status', cell: (user) => <StatusBadge status={user.status} /> },
                    {
                        header: 'Actions',
                        cell: (user) => (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => navigate(`/users/edit/${user.id}`)}>
                                    <IconEdit className="h-4 w-4" />
                                </Button>
                                {user.status === 'ACTIVE' && (
                                    <Button variant="ghost" size="icon" onClick={() => void onDisable(user.id)}>
                                        <IconUserX className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    )
}
