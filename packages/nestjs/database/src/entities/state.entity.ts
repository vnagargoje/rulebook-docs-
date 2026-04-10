import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { ulid } from 'ulid'
import { CityEntity } from './city.entity.js'
import { CountryEntity } from './country.entity.js'

@Entity({ name: 'states' })
export class StateEntity {
    @PrimaryColumn({ type: 'varchar', length: 26 })
    id: string

    @Column('varchar', { nullable: false })
    code: string

    @Column('varchar', { nullable: false })
    name: string

    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    latitude: number

    @Column('decimal', { precision: 11, scale: 8, nullable: true })
    longitude: number

    // Relations
    @ManyToOne(() => CountryEntity, (country) => country.states, {
        onDelete: 'CASCADE',
    })
    country: CountryEntity

    @OneToMany(() => CityEntity, (city) => city.state)
    cities: CityEntity[]

    @BeforeInsert()
    setId() {
        if (!this.id) {
            this.id = ulid()
        }
    }
}
