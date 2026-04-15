export type LoginFormValues = {
    email: string
    password: string
}

export type LoginFormProps = {
    isPending?: boolean
    onSubmit?: (data: LoginFormValues) => void
}
