export type CustomerProfileResponse = {
    id: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    mobilenumber?: string | null
}

export type UpdateCustomerProfilePayload = Partial<{
    firstName: string
    lastName: string
    email: string
    mobilenumber: string
}>
