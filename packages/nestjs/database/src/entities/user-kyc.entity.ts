import { KycDocumentType, KycStatus } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'

@Entity({ name: 'user_kycs' })
export class UserKycEntity extends IdTimestamppedEntity {
    // Properties
    @Column('varchar')
    documentId: string

    @Column('enum', { enum: KycDocumentType })
    type: KycDocumentType

    @Column('enum', { enum: KycStatus, default: KycStatus.PENDING })
    status: KycStatus

    @Column('datetime', { nullable: true })
    verifiedAt: Date

    @Column('text', { nullable: true })
    notes: string

    @Column('int', { default: 0, unsigned: true })
    attemptCount: number

    // Relations
    @Column('varchar')
    userId: string

    @ManyToOne(() => UserEntity, (u) => u.kycs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: UserEntity
}
