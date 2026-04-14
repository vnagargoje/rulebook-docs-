export interface CaslUser<Roles extends string = string> {
    id: string
    roles: Array<Roles>
}
