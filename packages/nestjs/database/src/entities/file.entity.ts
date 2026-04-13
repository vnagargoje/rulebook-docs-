import { Column, Entity } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity({ name: 'files' })
export class FileEntity extends IdTimestamppedEntity {
    // Properties
    @Column('varchar', { nullable: true })
    filename: string

    @Column('varchar')
    path: string

    @Column('varchar', { nullable: true })
    mimeType: string

    @Column('int', { nullable: true })
    size: number
}
