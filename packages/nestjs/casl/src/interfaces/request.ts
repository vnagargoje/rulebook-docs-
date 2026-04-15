import type { Request } from 'express'
import { CaslUser } from './user'
import { Subject } from '@casl/ability'

export interface CaslRequest<U extends CaslUser = CaslUser, S extends Subject = Subject> extends Request {
    user: U
    casl: {
        subject?: S
    }
}
