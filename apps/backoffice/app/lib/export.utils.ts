import * as XLSX from 'xlsx'
import fileSaver from 'file-saver'
const { saveAs } = fileSaver
import type { TransactionItem, PlanSnapshot, TopUpSnapshot } from '~/queries/transactions'
import type { UserItem } from '~/queries/users'
import type { BookingItem } from '~/queries/bookings'
import { formatDate } from '~/lib/formatter'

export const buildExportQueryParams = <T extends Record<string, any>>(statusFilter: string | undefined, dateFilter: string | undefined): T => {
    const exportParams: any = { limit: 10000, page: 1, sortBy: ['createdAt:DESC'] }

    if (statusFilter && statusFilter !== 'all') {
        exportParams['filter.status'] = [`$eq:${statusFilter}`]
    }

    if (dateFilter && dateFilter !== 'all') {
        let startDate = new Date()
        if (dateFilter === 'day') {
            startDate.setHours(0, 0, 0, 0)
        } else if (dateFilter === 'week') {
            const day = startDate.getDay()
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1)
            startDate = new Date(startDate.setDate(diff))
            startDate.setHours(0, 0, 0, 0)
        } else if (dateFilter === 'month') {
            startDate.setDate(1)
            startDate.setHours(0, 0, 0, 0)
        } else if (dateFilter === 'year') {
            startDate.setMonth(0, 1)
            startDate.setHours(0, 0, 0, 0)
        }
        exportParams['filter.createdAt'] = [`$gte:${startDate.toISOString()}`]
    }

    return exportParams as T
}

export const generateExcelFile = (data: any[], sheetName: string, fileNamePrefix: string, dateFilter?: string) => {
    const ws = XLSX.utils.json_to_sheet(data)
    
    if (data.length > 0) {
        const objectMaxLength: { wch: number }[] = []
        const keys = Object.keys(data[0])
        
        for (let i = 0; i < keys.length; i++) {
            objectMaxLength[i] = { wch: keys[i].length + 2 }
        }
        
        for (let i = 0; i < data.length; i++) {
            const values = Object.values(data[i])
            for (let j = 0; j < values.length; j++) {
                const val = values[j] !== null && values[j] !== undefined ? String(values[j]) : ''
                if (val.length + 2 > objectMaxLength[j].wch) {
                    objectMaxLength[j].wch = Math.min(50, val.length + 2)
                }
            }
        }
        ws['!cols'] = objectMaxLength
    }

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    const dateSuffix = dateFilter && dateFilter !== 'all' ? `_${dateFilter}` : ''
    saveAs(blob, `${fileNamePrefix}${dateSuffix}_${new Date().getTime()}.xlsx`)
}

export const formatTransactionForExport = (item: TransactionItem) => {
    const isTopUp = !!item.userTopUpId
    const topUpSnap = item.userTopUp?.topUpSnapshot as unknown as TopUpSnapshot
    const planSnap = item.userPlan?.planSnapshot as PlanSnapshot
    const description = isTopUp ? (topUpSnap?.name ?? 'Top-Up') : (planSnap?.name ?? 'N/A')
    const u = item.userPlan?.user
    const customerName = [u?.firstName, u?.lastName].filter(Boolean).join(' ') || 'N/A'
    const customerContact = u?.mobilenumber ?? u?.email ?? 'N/A'

    return {
        'Transaction ID': item.id,
        'Type': isTopUp ? 'Top-Up' : 'Plan',
        'Description': description,
        'Customer Name': customerName,
        'Customer Contact': customerContact,
        'Amount': item.amount,
        'Status': item.status.toUpperCase(),
        'Date': formatDate(item.createdAt),
        'Time': new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    }
}

export const formatEmployeeForExport = (item: UserItem) => {
    return {
        'Name': [item.firstName, item.lastName].filter(Boolean).join(' ') || 'N/A',
        'Email': item.email || 'N/A',
        'Mobile': item.mobilenumber || 'N/A',
        'Role': (item.properties as { roleName?: string })?.roleName ?? 'N/A',
        'Status': item.active !== false ? 'ACTIVE' : 'INACTIVE',
        'Created Date': (item as any).createdAt ? formatDate((item as any).createdAt) : 'N/A'
    }
}

export const formatCustomerForExport = (item: UserItem) => {
    return {
        'Name': [item.firstName, item.lastName].filter(Boolean).join(' ') || 'N/A',
        'Email': item.email || 'N/A',
        'Mobile': item.mobilenumber || 'N/A',
        'Status': item.active !== false ? 'ACTIVE' : 'INACTIVE',
        'Created Date': (item as any).createdAt ? formatDate((item as any).createdAt) : 'N/A'
    }
}

export const formatBookingForExport = (item: BookingItem) => {
    const u = (item.userPlan as any).user
    const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ') || 'N/A'
    const planSnapshot = (item.userPlan as any).planSnapshot ?? {}
    const plan = (item.userPlan as any).plan

    return {
        'Booking ID': item.id,
        'Customer Name': name,
        'Customer Contact': u?.mobilenumber ?? u?.email ?? 'N/A',
        'Plan Name': plan?.name ?? 'N/A',
        'Plan Amount': planSnapshot.totalAmount ?? plan?.totalAmount ?? 0,
        'Vehicle Number': (item as any).vehicle?.vehicleNumber ?? 'N/A',
        'Status': item.status.toUpperCase(),
        'Date of Purchase': formatDate(item.userPlan.createdAt)
    }
}
