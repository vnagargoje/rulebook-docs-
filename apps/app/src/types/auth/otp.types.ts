import type { z } from 'zod'
import type { otpSchema } from '@/schema/auth/auth.schema'

export type OTPFormValues = z.infer<typeof otpSchema>

export type OTPFormProps = {
    phone?: string
    isPending?: boolean
    onSubmit?: (data: OTPFormValues) => void | Promise<void>
}
