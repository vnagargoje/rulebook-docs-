import type { z } from 'zod'
import type { loginSchema } from '@/schema/auth/auth.schema'

export type LoginFormValues = z.infer<typeof loginSchema>

export type LoginFormProps = {
    isPending?: boolean
    onSubmit?: (data: LoginFormValues) => void | Promise<void>
}
