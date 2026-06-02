import { useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconCash,
    IconCreditCard,
    IconBolt,
    IconReceiptRupee,
    IconShieldCheck,
    IconUser,
} from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { DetailRow } from '~/components/ui/detail-row'
import { StatTile } from '~/components/ui/stat-tile'
import { useTransactionDetail } from '~/queries/transactions'
import { formatCurrency, formatDate, formatKm } from '~/lib/formatter'
import type { PlanSnapshot, TopUpSnapshot } from '~/types/admin'

export default function TransactionViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: transaction, isLoading } = useTransactionDetail(id)

    if (isLoading) {
        return (
            <div className='p-8 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse'>
                Loading Transaction...
            </div>
        )
    }

    if (!transaction) {
        return (
            <div className='p-8 text-center text-muted-foreground'>
                Transaction not found.
            </div>
        )
    }

    const isTopUp = !!transaction.userTopUpId
    const topUpSnap = transaction.userTopUp?.topUpSnapshot as unknown as TopUpSnapshot
    const planSnap = transaction.userPlan?.planSnapshot as PlanSnapshot

    const displayName = isTopUp ? (topUpSnap?.name ?? 'Top-Up') : (planSnap?.name ?? 'Plan')
    const totalAmount = transaction.amount
    const customer = transaction.userPlan?.user
    const customerName = [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || '—'
    const userId = transaction.userPlan?.userId

    return (
        <div className='mx-auto max-w-5xl space-y-6 pb-12'>
            <div className='flex items-center gap-4'>
                <Button variant='ghost' size='icon' onClick={() => navigate(-1)}>
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader title='Transaction Details' description={`ID: ${transaction.id}`} />
            </div>

            {/* Hero card */}
            <Card className='overflow-hidden border-border/40 bg-gradient-to-br from-primary/[0.06] via-white to-white shadow-sm'>
                <CardContent className='p-6'>
                    <div className='flex flex-wrap items-start justify-between gap-4'>
                        <div className='space-y-2'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <StatusBadge status={transaction.status.toUpperCase()} />
                                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isTopUp ? 'bg-amber-50 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                    {isTopUp ? 'Top-Up Purchase' : 'Plan Purchase'}
                                </span>
                            </div>
                            <h2 className='text-2xl font-semibold tracking-tight text-foreground'>{displayName}</h2>
                            <p className='text-sm text-muted-foreground'>
                                {isTopUp ? 'Applied on' : 'Purchased on'} {formatDate(transaction.createdAt)}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
                                Total Charged
                            </p>
                            <p className='mt-1 text-3xl font-bold text-foreground'>{formatCurrency(totalAmount)}</p>
                        </div>
                    </div>

                    <Separator className='my-5' />

                    {isTopUp ? (
                        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                            <StatTile label='KM Added' value={topUpSnap?.kmLimit ? formatKm(topUpSnap.kmLimit) : '—'} icon={IconBolt} />
                            {/* <StatTile label='Validity Extension' value={topUpSnap?.validityDays ? `+${topUpSnap.validityDays} days` : '—'} icon={IconCalendarEvent} /> */}
                            <StatTile label='Applied At' value={transaction.userTopUp?.appliedAt ? formatDate(transaction.userTopUp.appliedAt) : 'Pending'} icon={IconShieldCheck} />
                            <StatTile label='Order ID' value={<span className='text-xs font-mono'>{transaction.razorpayOrderId.slice(-8)}</span>} icon={IconReceiptRupee} />
                        </div>
                    ) : (
                        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                            <StatTile label='KM Limit' value={formatKm(planSnap?.kmLimit ?? 0)} icon={IconBolt} />
                            {/* <StatTile label='Validity' value={`${planSnap?.validityDays ?? 0} days`} icon={IconCalendarEvent} /> */}
                            <StatTile label='Remaining KM' value={formatKm(transaction.userPlan?.remainingKm ?? 0)} icon={IconShieldCheck} />
                            <StatTile label='Order ID' value={<span className='text-xs font-mono'>{transaction.razorpayOrderId.slice(-8)}</span>} icon={IconReceiptRupee} />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className='grid gap-6 xl:grid-cols-2'>
                {/* Payment breakdown */}
                <Card className='border-border/40 shadow-sm'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                            <IconCash size={15} />
                            Payment Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isTopUp ? (
                            <>
                                <DetailRow label='Base Price' value={formatCurrency(topUpSnap?.price ?? 0)} />
                                <DetailRow label='GST' value={`${topUpSnap?.gstPercentage ?? 0}%`} />
                                <div className='mt-2 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3'>
                                    <span className='text-sm font-bold text-foreground'>Total</span>
                                    <span className='text-base font-bold text-foreground'>{formatCurrency(totalAmount)}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <DetailRow label='Base Price' value={formatCurrency(planSnap?.price ?? 0)} />
                                <DetailRow label='Security Deposit' value={formatCurrency(planSnap?.deposit ?? 0)} />
                                <DetailRow label='GST' value={`${planSnap?.gstPercentage ?? 0}%`} />
                                <DetailRow label='Registration Fee' value={formatCurrency(planSnap?.registrationFee ?? 0)} />
                                <div className='mt-2 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3'>
                                    <span className='text-sm font-bold text-foreground'>Total</span>
                                    <span className='text-base font-bold text-foreground'>{formatCurrency(totalAmount)}</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Transaction details */}
                <Card className='border-border/40 shadow-sm'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                            <IconCreditCard size={15} />
                            {isTopUp ? 'Top-Up Details' : 'Plan Details'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DetailRow label='Transaction ID' value={<span className='font-mono text-xs'>{transaction.id}</span>} />
                        <DetailRow label='Razorpay Order' value={<span className='font-mono text-xs'>{transaction.razorpayOrderId}</span>} />
                        <DetailRow label='Payment ID' value={<span className='font-mono text-xs'>{transaction.razorpayPaymentId ?? '—'}</span>} />
                        <DetailRow label='Status' value={<StatusBadge status={transaction.status.toUpperCase()} />} />
                        {isTopUp ? (
                            <>
                                <DetailRow label='Top-Up ID' value={<span className='font-mono text-xs'>{transaction.userTopUp?.topUpId ?? '—'}</span>} />
                                <DetailRow label='Applied At' value={transaction.userTopUp?.appliedAt ? formatDate(transaction.userTopUp.appliedAt) : null} />
                            </>
                        ) : (
                            <>
                                <DetailRow label='Plan ID' value={<span className='font-mono text-xs'>{transaction.userPlan?.planId ?? '—'}</span>} />
                                <DetailRow label='Active From' value={transaction.userPlan?.startsAt ? formatDate(transaction.userPlan.startsAt) : null} />
                                <DetailRow label='Expires On' value={transaction.userPlan?.expiresAt ? formatDate(transaction.userPlan.expiresAt) : null} />
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Applied-to plan card – only for top-ups */}
                {isTopUp && transaction.userPlan && (
                    <Card className='border-border/40 shadow-sm'>
                        <CardHeader className='pb-2'>
                            <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                                <IconReceiptRupee size={15} />
                                Applied to Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DetailRow label='Plan Name' value={(transaction.userPlan.planSnapshot as PlanSnapshot)?.name ?? '—'} />
                            <DetailRow label='User Plan ID' value={<span className='font-mono text-xs'>{transaction.userPlan.id}</span>} />
                            <DetailRow label='Plan Status' value={<StatusBadge status={transaction.userPlan.status.toUpperCase()} />} />
                            <DetailRow label='Remaining KM' value={formatKm(transaction.userPlan.remainingKm)} />
                            <DetailRow label='Active From' value={transaction.userPlan.startsAt ? formatDate(transaction.userPlan.startsAt) : null} />
                            <DetailRow label='Expires On' value={transaction.userPlan.expiresAt ? formatDate(transaction.userPlan.expiresAt) : null} />
                        </CardContent>
                    </Card>
                )}

                {/* Customer details */}
                <Card className={`border-border/40 shadow-sm ${isTopUp && transaction.userPlan ? '' : 'xl:col-span-2'}`}>
                    <CardHeader className='pb-2'>
                        <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                            <IconUser size={15} />
                            Customer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-wrap items-center gap-6'>
                        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <IconUser size={24} />
                        </div>
                        <div className='space-y-1'>
                            <p className='text-base font-semibold text-foreground'>{customerName}</p>
                            {customer?.mobilenumber && (
                                <p className='text-sm text-muted-foreground'>{customer.mobilenumber}</p>
                            )}
                            {customer?.email && (
                                <p className='text-sm text-muted-foreground'>{customer.email}</p>
                            )}
                            <p className='font-mono text-xs text-muted-foreground'>{userId ?? '—'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
