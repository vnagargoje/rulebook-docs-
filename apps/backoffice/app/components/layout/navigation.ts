import {
    IconArrowsLeftRight,
    IconBattery,
    IconChecklist,
    IconClipboardCheck,
    IconLayoutDashboard,
    IconMapPin,
    IconMotorbike,
    IconReceiptRupee,
    IconTool,
    IconUsers,
} from '@tabler/icons-react'

export const NAVIGATION_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', description: 'Operations overview', icon: IconLayoutDashboard },
    { to: '/users', label: 'Users', description: 'Employees and customers', icon: IconUsers },
    { to: '/stations', label: 'Stations', description: 'Hubs and swap stations', icon: IconMapPin },
    { 
        label: 'Plans', 
        description: 'Manage subscriptions', 
        icon: IconReceiptRupee,
        children: [
            { to: '/plans', label: 'Subscription Plan', description: 'Monthly & yearly plans' },
            { to: '/top-up-plans', label: 'Top-up Plan', description: 'Additional ride packs' },
        ]
    },
    { to: '/vehicles', label: 'Vehicles', description: 'Fleet registration', icon: IconMotorbike },
    { to: '/maintenance', label: 'Maintenance', description: 'Service records', icon: IconTool },
    { to: '/inactive-vehicles', label: 'Inactive Vehicles', description: 'Downtime tracking', icon: IconChecklist },
    { to: '/assignments', label: 'Assignments', description: 'Vehicle allocation', icon: IconArrowsLeftRight },
    { to: '/batteries', label: 'Batteries', description: 'Inventory and stations', icon: IconBattery },
    { to: '/surrender', label: 'Surrender', description: 'Closure workflow', icon: IconClipboardCheck },
]
