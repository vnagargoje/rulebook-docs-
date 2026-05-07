import { REGITRATION_FEE } from '@yugo/shared'
import { AfterLoad, Column, Entity } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity({ name: 'plans' })
export class PlanEntity extends IdTimestamppedEntity {
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

    @Column('decimal', { precision: 10, scale: 2 })
    deposit: number

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    gstPercentage: number

    @Column('boolean', { default: true })
    active: boolean

    totalAmount: number
    registrationFee: number

    @AfterLoad()
    calculateTotalAmount() {
        const basePrice = Number(this.price || 0)
        const deposit = Number(this.deposit || 0)
        this.totalAmount = basePrice + deposit
        this.registrationFee = REGITRATION_FEE
    }
}
