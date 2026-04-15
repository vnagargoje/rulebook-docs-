import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { UserKycEntity, UserEntity } from '@yugo/nestjs-database/entities'
import { EntityManager } from 'typeorm'
import { GetKycStatusQuery } from '../../impl/kyc/get-kyc-status.query.js'
import { KycDocumentType } from '@yugo/shared'
import { NotFoundException } from '@nestjs/common'

@QueryHandler(GetKycStatusQuery)
export class GetKycStatusHandler implements IQueryHandler<GetKycStatusQuery> {
    constructor(
        @InjectEntityManager()
        private readonly manager: EntityManager,
    ) {}

    async execute(query: GetKycStatusQuery) {
        const { userId } = query
        const user = await this.manager.findOne(UserEntity, { where: { id: userId } })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const kycs = await this.manager.find(UserKycEntity, {
            where: { userId },
        })
        const mapKyc = (kyc?: UserKycEntity) => {
            if (!kyc) return null
            return {
                id: kyc.id,
                documentId: kyc.documentId,
                type: kyc.type,
                status: kyc.status,
                verifiedAt: kyc.verifiedAt ? kyc.verifiedAt.toISOString() : null,
                notes: kyc.notes || null,
            }
        }
        const response = {
            aadhaar: mapKyc(kycs.find((k) => k.type === KycDocumentType.AADHAR)),
            pan: mapKyc(kycs.find((k) => k.type === KycDocumentType.PAN)),
            license: mapKyc(kycs.find((k) => k.type === KycDocumentType.DRIVING_LICENSE)),
        }
        return response
    }
}
