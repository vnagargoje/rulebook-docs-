import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { NotificationDeliveryStatus } from '@yugo/shared'
import { NotificationEntity } from './notification.entity.js'

@Entity({ name: 'notification_delivery' })
export class NotificationDeliveryEntity extends IdTimestamppedEntity {
    @Column('varchar')
    eventId: string

    @Column('enum', { enum: NotificationDeliveryStatus })
    status: NotificationDeliveryStatus

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string | null

    @Column({ type: 'text' })
    body: string

    @Column({ type: 'text' })
    message: string

    @ManyToOne(() => NotificationEntity, { onDelete: 'NO ACTION' })
    @JoinColumn()
    notification: NotificationEntity
}
