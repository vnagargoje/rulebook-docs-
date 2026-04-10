import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ulid } from 'ulid'
import { StateEntity } from './state.entity.js'

@Entity({ name: 'cities' })
export class CityEntity {
    @PrimaryColumn({ type: 'varchar', length: 26 })
    id: string

    @Column({ type: 'varchar' })
    name: string

    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    latitude: number

    @Column('decimal', { precision: 11, scale: 8, nullable: true })
    longitude: number

    @ManyToOne(() => StateEntity, (state) => state.cities, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    state: StateEntity

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = ulid()
        }
    }
}
