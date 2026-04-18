export const roleOptions = [
    { label: 'Customer', value: 'customer' },
    { label: 'Swap Manager', value: 'swap_manager' },
    { label: 'Hub Manager', value: 'hub_manager' },
    { label: 'System Admin', value: 'system_admin' },
] as const

export const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
] as const

export const allowedRoles = ['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user'] as const
export const allowedGenders = ['male', 'female', 'other'] as const
