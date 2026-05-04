import { Column, Entity } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity({ name: 'top_ups' })
export class TopUpEntity extends IdTimestamppedEntity {
    @Column('varchar', { length: 150, unique: true })
    name: string

    @Column('text', { nullable: true })
    description: string

    @Column('int')
    validityDays: number

    @Column('decimal', { precision: 10, scale: 2 })
    kmLimit: number

    @Column('decimal', { precision: 10, scale: 2 })
    price: number

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    gst: number

    @Column('boolean', { default: true })
    active: boolean
}
