export const roleOptions = [
    { label: 'Customer', value: 'customer' },
    { label: 'Swap Manager', value: 'swap_manager' },
    { label: 'Hub Manager', value: 'hub_manager' },
    { label: 'System Admin', value: 'system_admin' },
    { label: 'System User', value: 'system_user' },
] as const

export const employeeRoleOptions = roleOptions.filter((role) => role.value !== 'customer')
export const ALLOWED_EMPLOYEE_ROLES = ['swap_manager', 'hub_manager'] as const
export const filteredEmployeeRoles = employeeRoleOptions.filter((role) =>
    ALLOWED_EMPLOYEE_ROLES.includes(role.value as (typeof ALLOWED_EMPLOYEE_ROLES)[number]),
)
export const customerRoleOptions = roleOptions.filter((role) => role.value === 'customer')

export const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
] as const

export const allowedRoles = ['customer', 'swap_manager', 'hub_manager', 'system_admin', 'system_user'] as const
export const allowedGenders = ['male', 'female', 'other'] as const
