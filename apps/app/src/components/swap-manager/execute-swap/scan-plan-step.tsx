import React from 'react'

import { QrScanner } from '@/components/ui'

interface Props {
    onScan: (data: string) => void
}

export const ScanPlanStep = ({ onScan }: Props) => {
    return (
        <QrScanner
            title='Scan Customer QR'
            description='Align the QR code on the customer app within the frame to begin'
            onScan={onScan}
        />
    )
}
