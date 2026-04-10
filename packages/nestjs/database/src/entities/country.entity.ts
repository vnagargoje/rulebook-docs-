import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { StateEntity } from './state.entity.js'

@Entity({ name: 'countries' })
export class CountryEntity {
    @PrimaryColumn({ type: 'varchar' })
    code: string

    @Column({ type: 'varchar', nullable: true })
    name: string

    @OneToMany(() => StateEntity, (state) => state.country)
    states: StateEntity[]
}
