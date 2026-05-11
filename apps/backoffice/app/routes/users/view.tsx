import { useLocation, useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconCalendarEvent,
    IconEdit,
    IconMail,
    IconMapPin,
    IconPhone,
    IconUser,
} from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { DetailRow } from '~/components/ui/detail-row'
import { SectionLabel } from '~/components/ui/section-label'
import { StatTile } from '~/components/ui/stat-tile'
import { MetaPill } from '~/components/ui/meta-pill'
import { useGetUserById } from '~/queries/users'
import { formatDate, formatLabel } from '~/lib/formatter'

function getUserProperties(properties: unknown) {
    if (!properties) return {}

    if (typeof properties === 'string') {
        try {
            const parsed = JSON.parse(properties)
            return parsed && typeof parsed === 'object' ? parsed : {}
        } catch {
            return {}
        }
    }

    return typeof properties === 'object' ? properties : {}
}

function formatMobileNumber(mobile?: string) {
    if (!mobile) return '—'

    const normalizedMobile = mobile.trim()
    return /^91\d{10}$/.test(normalizedMobile) ? normalizedMobile.slice(2) : normalizedMobile
}

function formatAddress(address?: {
    lineOne?: string
    lineTwo?: string
    pincode?: string
    city?: { name?: string; state?: { name?: string } }
}) {
    if (!address) return '—'

    return [address.lineOne, address.lineTwo, address.city?.name, address.city?.state?.name, address.pincode]
        .filter(Boolean)
        .join(', ')
}

export default function UserViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { data: user, isLoading } = useGetUserById(id)

    const isCustomerRoute = location.pathname.startsWith('/customers')
    const backPath = isCustomerRoute ? '/customers' : '/users'
    const editPath = isCustomerRoute ? `/customers/edit/${id}` : `/users/edit/${id}`

    if (isLoading) {
        return (
            <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">
                Loading User...
            </div>
        )
    }

    if (!user) {
        return (
            <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">
                User not found
            </div>
        )
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed User'
    const properties = getUserProperties(user.properties) as { roleName?: string }
    const roleName = properties.roleName ?? user.roles?.[0]?.name
    const currentAddress = user.addresses?.find((address) => address.type === 'current')
    const permanentAddress = user.addresses?.find((address) => address.type === 'permanent')
    const displayMobile = formatMobileNumber(user.mobilenumber)
    const gender = user.gender ? formatLabel(user.gender) : '—'
    const role = roleName ? formatLabel(roleName) : '—'
    const createdAt = (user as any)?.createdAt as string | undefined
    const updatedAt = (user as any)?.updatedAt as string | undefined

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(backPath)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title={name}
                    description={isCustomerRoute ? 'Full customer profile details.' : 'Full employee profile details.'}
                />
                <Button variant="outline" className="ml-auto shrink-0" onClick={() => navigate(editPath)}>
                    <IconEdit size={16} className="mr-2" />
                    Edit
                </Button>
            </div>

            <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-primary/[0.06] via-white to-white shadow-sm">
                <CardHeader className="border-b border-border/40">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">{name}</CardTitle>
                            <CardDescription className="mt-1">{user.email || displayMobile}</CardDescription>
                        </div>
                        <StatusBadge status={role} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <MetaPill icon={IconPhone}>{displayMobile}</MetaPill>
                        {user.email ? <MetaPill icon={IconMail}>{user.email}</MetaPill> : null}
                        {createdAt ? <MetaPill icon={IconCalendarEvent}>Joined {formatDate(createdAt)}</MetaPill> : null}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <StatTile label="Role" value={role} icon={IconUser} />
                        <StatTile label="Gender" value={gender} icon={IconUser} />
                        <StatTile label="Address Entries" value={(user.addresses?.length ?? 0).toString()} icon={IconMapPin} />
                        <StatTile label="Station" value={user.stationId ?? '—'} icon={IconMapPin} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Primary account and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Basic Info</SectionLabel>
                        <DetailRow label="User ID" value={user.id} />
                        <DetailRow label="First Name" value={user.firstName ?? '—'} />
                        <DetailRow label="Last Name" value={user.lastName ?? '—'} />
                        <DetailRow label="Email" value={user.email ?? '—'} />
                        <DetailRow label="Mobile" value={displayMobile} />
                        <DetailRow label="Gender" value={gender} />
                        <DetailRow label="Date of Birth" value={user.dateOfBirth ? formatDate(user.dateOfBirth) : '—'} />
                        <DetailRow label="Role" value={role} />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Addresses</CardTitle>
                        <CardDescription>Current and permanent address records.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Permanent Address</SectionLabel>
                        <DetailRow label="Address" value={formatAddress(permanentAddress)} />
                        <DetailRow label="State" value={permanentAddress?.city?.state?.name ?? '—'} />
                        <DetailRow label="City" value={permanentAddress?.city?.name ?? '—'} />
                        <DetailRow label="PIN Code" value={permanentAddress?.pincode ?? '—'} />

                        <SectionLabel className="mt-6">Current Address</SectionLabel>
                        <DetailRow label="Address" value={formatAddress(currentAddress)} />
                        <DetailRow label="State" value={currentAddress?.city?.state?.name ?? '—'} />
                        <DetailRow label="City" value={currentAddress?.city?.name ?? '—'} />
                        <DetailRow label="PIN Code" value={currentAddress?.pincode ?? '—'} />
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                <CardHeader className="border-b border-border/40">
                    <CardTitle>Audit</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                        <DetailRow label="Created At" value={createdAt ? formatDate(createdAt) : '—'} />
                        <DetailRow label="Updated At" value={updatedAt ? formatDate(updatedAt) : '—'} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}