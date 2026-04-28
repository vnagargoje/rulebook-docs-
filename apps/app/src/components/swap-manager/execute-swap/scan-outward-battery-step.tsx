import React from 'react'

import { QrScanner } from '@/components/ui'

interface Props {
    onScan: (data: string) => void
}

export const ScanOutwardBatteryStep = ({ onScan }: Props) => {
    return (
        <QrScanner
            title='Scan Outward Battery'
            description='Scan the fresh battery QR code to complete the swap'
            onScan={onScan}
        />
    )
}
