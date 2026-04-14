declare namespace Express {
    export interface User {
        id: string
        roles: Array<string>
    }
    export interface Request {
        user?: User
    }
}
