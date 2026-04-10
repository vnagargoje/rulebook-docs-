import { Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'roles' })
export class RoleEntity {
    @PrimaryColumn('varchar')
    name: string
}
