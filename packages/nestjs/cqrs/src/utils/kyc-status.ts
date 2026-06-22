import { UserKycEntity } from '@yugo/nestjs-database/entities'
import { KycDocumentType, KycStatus } from '@yugo/shared'

export function computeKycStatus(kycs?: UserKycEntity[]): KycStatus {
    if (!kycs || kycs.length === 0) {
        return KycStatus.PENDING
    }

    const hasManualRequest = kycs.some((k) => k.status?.toLowerCase() === KycStatus.MANUAL_VERIFICATION_REQUESTED)
    if (hasManualRequest) {
        return KycStatus.MANUAL_VERIFICATION_REQUESTED
    }

    const mandatoryDocs = [KycDocumentType.AADHAR, KycDocumentType.PAN, KycDocumentType.DRIVING_LICENSE]
    const approvedMandatoryDocs = kycs.filter((k) => {
        const type = k.type?.toLowerCase() as KycDocumentType
        const status = k.status?.toLowerCase() as KycStatus
        return mandatoryDocs.includes(type) && (status === KycStatus.APPROVED || status === KycStatus.VERIFIED)
    })

    // Check if we have unique approved docs for all 3 types
    const uniqueApprovedTypes = new Set(approvedMandatoryDocs.map((k) => k.type?.toLowerCase()))

    if (uniqueApprovedTypes.size === mandatoryDocs.length) {
        return KycStatus.APPROVED
    } else {
        return KycStatus.PENDING
    }
}
