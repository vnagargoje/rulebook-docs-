import { type PlanSnapshotProperties, UserPlanStatus } from '@yugo/shared'
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

    @Column('int', { nullable: true })
    batteryPercentAtTimeOfSwap: number

    @ManyToOne(() => PlanEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    plan: PlanEntity

    @Column('json')
    planSnapshot: PlanSnapshotProperties

    @Column('enum', { enum: UserPlanStatus, default: UserPlanStatus.PENDING })
    status: UserPlanStatus

    @Column('datetime', { nullable: true })
    startsAt: Date

    @Column('datetime', { nullable: true })
    expiresAt: Date

    @Column('decimal', { precision: 10, scale: 2 })
    remainingKm: number

    @Column('decimal', { precision: 10, scale: 2 })
    totalKm: number

    @Column('varchar', { nullable: true })
    qrCodeId: string

    @OneToOne(() => FileEntity, { nullable: true, cascade: true })
    @JoinColumn()
    qrCode: FileEntity

    @OneToMany(() => UserTopUpEntity, (t) => t.userPlan)
    topUps: UserTopUpEntity[]
}
