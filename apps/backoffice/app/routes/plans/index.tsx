import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { mockApi } from '~/services/mockApi'
import { type Plan } from '~/types/admin'
import { toast } from 'sonner'
import { formatCurrency } from '~/lib/admin'

export default function PlansListRoute() {
    const navigate = useNavigate()
    const [plans, setPlans] = useState<Plan[]>([])

    const loadPlans = useCallback(async () => {
        try {
            const data = await mockApi.listPlans('plans')
            setPlans(data)
        } catch (error) {
            toast.error('Failed to load plans')
        }
    }, [])

    useEffect(() => {
        void loadPlans()
    }, [loadPlans])

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
                title="All Plans"
                data={plans}
                emptyMessage="No plans found."
                columns={[
                    { header: 'Plan Name', accessor: 'name' },
                    { header: 'Validity (Days)', accessor: 'validityDays' },
                    { header: 'KM Range', cell: (plan) => `${plan.kmRange} km` },
                    { header: 'Price', cell: (plan) => formatCurrency(plan.price) },
                    { header: 'Deposit', cell: (plan) => formatCurrency(plan.deposit) },
                    { header: 'Status', cell: (plan) => <StatusBadge status={plan.status} /> },
                    {
                        header: 'Actions',
                        cell: (plan) => (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/plans/edit/${plan.id}`)}>
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    )
}
