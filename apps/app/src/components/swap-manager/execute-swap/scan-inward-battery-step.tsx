import React from 'react'

import { QrScanner } from '@/components/ui'

interface Props {
    onScan: (data: string) => void
}

export const ScanInwardBatteryStep = ({ onScan }: Props) => {
    return (
        <QrScanner
            title='Scan Inward Battery'
            description='Scan the battery QR code being returned by the customer'
            onScan={onScan}
        />
    )
}
