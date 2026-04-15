import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { mockApi } from '~/services/mockApi'
import { type Station } from '~/types/admin'
import { toast } from 'sonner'

export default function StationsListRoute() {
    const navigate = useNavigate()
    const [stations, setStations] = useState<Station[]>([])

    const loadStations = useCallback(async () => {
        try {
            const data = await mockApi.listStations()
            setStations(data)
        } catch (error) {
            toast.error('Failed to load stations')
        }
    }, [])

    useEffect(() => {
        void loadStations()
    }, [loadStations])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Station Management"
                    description="Manage physical stations for swapping, charging, and vehicle hubs."
                />
                <Button onClick={() => navigate('/stations/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New Station
                </Button>
            </div>

            <ResourceTable
                title="All Stations"
                data={stations}
                emptyMessage="No stations found."
                columns={[
                    { header: 'Code', accessor: 'code' },
                    { header: 'Name', accessor: 'name' },
                    { header: 'Type', cell: (station) => station.type.replace(/_/g, ' ') },
                    { header: 'City', cell: (station) => station.address.city },
                    { header: 'Status', cell: (station) => <StatusBadge status={station.status} /> },
                    {
                        header: 'Actions',
                        cell: (station) => (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/stations/edit/${station.id}`)}>
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    )
}
