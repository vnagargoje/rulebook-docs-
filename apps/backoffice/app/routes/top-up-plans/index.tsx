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
import { formatCurrency } from '~/lib/formatter'

export default function TopUpPlansListRoute() {
    const navigate = useNavigate()
    const [plans, setPlans] = useState<Plan[]>([])

    const loadPlans = useCallback(async () => {
        try {
            const data = await mockApi.listPlans('topUpPlans')
            setPlans(data)
        } catch (error) {
            toast.error('Failed to load top-up plans')
        }
    }, [])

    useEffect(() => {
        void loadPlans()
    }, [loadPlans])

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
                title="All Top-Ups"
                data={plans}
                emptyMessage="No top-up plans found."
                columns={[
                    { header: 'Plan Name', accessor: 'name' },
                    { header: 'Validity (Days)', accessor: 'validityDays' },
                    { header: 'KM Range', cell: (plan) => `${plan.kmRange} km` },
                    { header: 'Price', cell: (plan) => formatCurrency(plan.price) },
                    { header: 'Status', cell: (plan) => <StatusBadge status={plan.status} /> },
                    {
                        header: 'Actions',
                        cell: (plan) => (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/top-up-plans/edit/${plan.id}`)}>
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    )
}
