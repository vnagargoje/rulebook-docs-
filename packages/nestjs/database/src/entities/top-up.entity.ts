import { AfterLoad, Column, Entity } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity({ name: 'top_ups' })
export class TopUpEntity extends IdTimestamppedEntity {
    @Column('varchar', { length: 150, unique: true })
    name: string

    @Column('text', { nullable: true })
    description: string

    @Column('decimal', { precision: 10, scale: 2 })
    kmLimit: number

    @Column('decimal', { precision: 10, scale: 2 })
    price: number

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    gstPercentage: number

    @Column('boolean', { default: true })
    active: boolean

    totalAmount: number

    @AfterLoad()
    calculateTotalAmount() {
        const basePrice = Number(this.price || 0)
        const gstPercentage = Number(this.gstPercentage || 0)

        const gstAmount = (basePrice * gstPercentage) / 100
        this.totalAmount = Math.ceil(basePrice + gstAmount)
    }
}
