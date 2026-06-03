import { useState } from 'react'
import { IconDownload, IconLoader2 } from '@tabler/icons-react'
import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { DATE_FILTER_OPTIONS } from '~/constants'

export interface ExportFilters {
    dateFilter: string
    statusFilter: string
}

interface ExportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    isExporting: boolean
    onExport: (filters: ExportFilters) => void
    showDateFilter?: boolean
    showStatusFilter?: boolean
    statusOptions?: { label: string; value: string }[]
}

export function ExportDialog({ 
    open, 
    onOpenChange,
    title = 'Export Data',
    description = 'Select filters for your export. The file will be downloaded as an Excel spreadsheet.',
    isExporting,
    onExport,
    showDateFilter = true,
    showStatusFilter = false,
    statusOptions = []
}: ExportDialogProps) {
    const [exportDateFilter, setExportDateFilter] = useState('all')
    const [exportStatusFilter, setExportStatusFilter] = useState('all')

    const onDownload = () => {
        onExport({
            dateFilter: exportDateFilter,
            statusFilter: exportStatusFilter
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant='outline' className='gap-2 bg-white'>
                    <IconDownload className='h-4 w-4' />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className={`grid gap-6 py-6 ${showDateFilter && showStatusFilter ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {showDateFilter && (
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Time Period</label>
                        <Select value={exportDateFilter} onValueChange={setExportDateFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                {DATE_FILTER_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    )}
                    {showStatusFilter && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Status</label>
                        <Select value={exportStatusFilter} onValueChange={setExportStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    )}
                </div>
                <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={onDownload} disabled={isExporting} className="gap-2">
                        {isExporting ? <IconLoader2 className="h-4 w-4 animate-spin" /> : <IconDownload className="h-4 w-4" />}
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
