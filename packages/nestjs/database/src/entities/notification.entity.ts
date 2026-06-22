import { Column, Entity, Index, OneToMany } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { NotificationChannel } from '@yugo/shared'
import { NotificationDeliveryEntity } from './notification-delivery.entity.js'

@Entity({ name: 'notification' })
@Index(['eventKey'])
export class NotificationEntity extends IdTimestamppedEntity {
    @Column('varchar', { length: 255, unique: true })
    name: string

    @Column('text', { nullable: true })
    description: string

    @Column('varchar')
    eventKey: string

    @Column('enum', { enum: NotificationChannel })
    channel: NotificationChannel

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string | null

    @Column({ type: 'text' })
    body: string

    @Column('boolean', { default: true })
    active: boolean

    @OneToMany(() => NotificationDeliveryEntity, (notificationDelivery) => notificationDelivery.notification)
    notificationDelivery: NotificationDeliveryEntity[]
}
