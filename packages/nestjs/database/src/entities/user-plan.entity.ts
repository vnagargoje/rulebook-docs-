import { UserPlanStatus } from '@yugo/shared'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { FileEntity } from './file.entity.js'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { PlanEntity } from './plan.entity.js'
import { UserEntity } from './user.entity.js'
import { UserTopUpEntity } from './user-top-up.entity.js'

@Entity({ name: 'user_plans' })
export class UserPlanEntity extends IdTimestamppedEntity {
    @Column('varchar')
    userId: string

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity

    @Column('varchar')
    planId: string

    @ManyToOne(() => PlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    plan: PlanEntity

    @Column('json')
    planSnapshot: Record<string, any>

    @Column('enum', { enum: UserPlanStatus, default: UserPlanStatus.ACTIVE })
    status: UserPlanStatus

    @Column('datetime', { nullable: true })
    startsAt: Date

    @Column('datetime', { nullable: true })
    expiresAt: Date

    @Column('decimal', { precision: 10, scale: 2 })
    remainingKm: number

    @Column('varchar', { nullable: true })
    qrCodeId: string

    @OneToOne(() => FileEntity, { nullable: true, cascade: true })
    @JoinColumn()
    qrCode: FileEntity

    @OneToMany(() => UserTopUpEntity, (t) => t.userPlan)
    topUps: UserTopUpEntity[]
}
