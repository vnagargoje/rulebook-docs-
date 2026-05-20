import { useLocation, useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconCalendarEvent,
    IconCheck,
    IconEdit,
    IconHistory,
    IconId,
    IconMail,
    IconMapPin,
    IconPhone,
    IconUser,
    IconX,
} from '@tabler/icons-react'
import { KycStatus } from '@yugo/shared'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { DetailRow } from '~/components/ui/detail-row'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { MetaPill } from '~/components/ui/meta-pill'
import { PageHeader } from '~/components/ui/page-header'
import { SectionLabel } from '~/components/ui/section-label'
import { StatTile } from '~/components/ui/stat-tile'
import { StatusBadge } from '~/components/ui/status-badge'
import { formatDate, formatLabel } from '~/lib/formatter'
import { useCustomerKyc, useUpdateKycStatus } from '~/queries/kyc'
import { useGetUserById } from '~/queries/users'

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

    const { data: kycData } = useCustomerKyc(id)
    const manualReviewKycs =
        kycData?.data?.filter(
            (kyc) => kyc.status === KycStatus.MANUAL_VERIFICATION_REQUESTED,
        ) ?? []
    const manualKyc = manualReviewKycs[0]
    const { mutate: updateKycStatus, isPending: isUpdatingKyc } = useUpdateKycStatus()

    if (isLoading) {
        return (
            <div className="animate-pulse p-8 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Loading User...
            </div>
        )
    }

    if (!user) {
        return (
            <div className="p-8 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
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
                {!isCustomerRoute && (
                    <Button variant="outline" className="ml-auto shrink-0" onClick={() => navigate(editPath)}>
                        <IconEdit size={16} className="mr-2" />
                        Edit
                    </Button>
                )}
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

            {manualKyc && (
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconId size={18} />
                                    </span>
                                    Manual KYC Verification
                                </CardTitle>
                                <CardDescription className="max-w-2xl">
                                    {isCustomerRoute
                                        ? 'Customer submitted a document for manual review. Verify the request and take the next action from this panel.'
                                        : 'Employee submitted a document for manual review. Verify the request and take the next action from this panel.'}
                                </CardDescription>
                            </div>
                            <StatusBadge status={manualKyc.status.toUpperCase()} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
                            <div className="rounded-2xl border border-border/50 bg-slate-50/70 p-5">
                                <SectionLabel>Document Information</SectionLabel>
                                <div className="mt-4 grid gap-x-6 gap-y-3 md:grid-cols-2">
                                    <DetailRow label="Document ID" value={manualKyc.documentId || '—'} />
                                    <DetailRow label="Document Type" value={formatLabel(manualKyc.type)} />
                                    <DetailRow
                                        label="Submitted At"
                                        value={manualKyc.createdAt ? formatDate(manualKyc.createdAt as string) : '—'}
                                    />
                                    <DetailRow label="Current Status" value={formatLabel(manualKyc.status)} />
                                </div>
                                <div className="mt-4 border-t border-border/40 pt-4">
                                    <DetailRow label="Notes" value={manualKyc.notes || '—'} />
                                </div>
                            </div>

                            <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-white p-5 shadow-sm">
                                <SectionLabel>Verification Actions</SectionLabel>
                                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                    Approve if the submitted details are valid, or reject and add a reason for the review outcome.
                                </p>
                                <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
                                    {manualKyc.status !== KycStatus.APPROVED && (
                                        <Button
                                            onClick={() => updateKycStatus({ id: manualKyc.id, status: KycStatus.APPROVED })}
                                            disabled={isUpdatingKyc}
                                            className="h-11 w-full bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <IconCheck size={16} className="mr-2" />
                                            Approve Verification
                                        </Button>
                                    )}
                                    {manualKyc.status !== KycStatus.REJECTED && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                const reason = window.prompt('Enter rejection reason:')
                                                if (reason !== null) {
                                                    updateKycStatus({
                                                        id: manualKyc.id,
                                                        status: KycStatus.REJECTED,
                                                        notes: reason,
                                                    })
                                                }
                                            }}
                                            disabled={isUpdatingKyc}
                                            className="h-11 w-full"
                                        >
                                            <IconX size={16} className="mr-2" />
                                            Reject Verification
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

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

            {kycData?.data && kycData.data.length > 0 && (
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <IconHistory size={18} />
                            </span>
                            KYC History
                        </CardTitle>
                        <CardDescription>All KYC submissions for this user.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Document ID</TableHead>
                                    <TableHead>Attempts</TableHead>
                                    <TableHead>Verified At</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kycData.data.map((kyc) => (
                                    <TableRow key={kyc.id}>
                                        <TableCell className="font-medium">{formatLabel(kyc.type)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={kyc.status.toUpperCase()} />
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{kyc.documentId || '—'}</TableCell>
                                        <TableCell className="text-center">{kyc.attemptCount ?? '—'}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {kyc.verifiedAt ? formatDate(kyc.verifiedAt) : '—'}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {kyc.createdAt ? formatDate(kyc.createdAt) : '—'}
                                        </TableCell>
                                        <TableCell className="max-w-50 truncate text-xs text-muted-foreground">
                                            {kyc.notes || '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

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
