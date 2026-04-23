import { PaymentStatus } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserPlanEntity } from './user-plan.entity.js'

@Entity({ name: 'transactions' })
export class TransactionEntity extends IdTimestamppedEntity {
    // properties
    @Column('varchar', { unique: true })
    razorpayOrderId: string

    @Column('varchar', { nullable: true })
    razorpayPaymentId: string

    @Column('varchar', { nullable: true })
    razorpaySignature: string

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number

    @Column('varchar', { length: 10, default: 'INR' })
    currency: string

    @Column('enum', { enum: PaymentStatus, default: PaymentStatus.AWAITING })
    status: PaymentStatus

    @Column('text', { nullable: true })
    notes: string

    // relations
    @Column('varchar')
    userPlanId: string

    @ManyToOne(() => UserPlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    userPlan: UserPlanEntity
}
