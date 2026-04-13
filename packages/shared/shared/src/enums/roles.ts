export enum ApplicationRoles {
    CUSTOMER = 'customer',
    SWAP_MANAGER = 'swap_manager',
    HUB_MANAGER = 'hub_manager',
}

export enum SystemRoles {
    SYSTEM_ADMIN = 'system_admin',
    SYSTEM_USER = 'system_user',
}

export const Roles = { ...ApplicationRoles, ...SystemRoles }
export type Roles = typeof Roles
