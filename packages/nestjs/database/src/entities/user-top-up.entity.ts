import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { TopUpEntity } from './top-up.entity.js'
import { UserPlanEntity } from './user-plan.entity.js'
import { UserEntity } from './user.entity.js'
import { UserTopUpStatus } from '@yugo/shared'

@Entity({ name: 'user_top_ups' })
export class UserTopUpEntity extends IdTimestamppedEntity {
    @Column('varchar')
    userId: string

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity

    @Column('varchar')
    userPlanId: string

    @ManyToOne(() => UserPlanEntity, (up) => up.topUps, { onDelete: 'CASCADE' })
    @JoinColumn()
    userPlan: UserPlanEntity

    @Column('varchar')
    topUpId: string

    @ManyToOne(() => TopUpEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    topUp: TopUpEntity

    @Column('json', { nullable: true })
    topUpSnapshot: Record<string, any> | null

    @Column('enum', { enum: UserTopUpStatus, default: UserTopUpStatus.AWAITING })
    status: UserTopUpStatus

    @Column('datetime', { nullable: true })
    appliedAt: Date | null
}
