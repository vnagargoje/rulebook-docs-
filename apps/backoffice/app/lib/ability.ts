export function canAccessAdminPanel(roles: string[]): boolean {
    // Backend roles are currently coming in as lowercase snake_case
    const authorizedRoles = [
        'system_admin',
        'hub_manager',
        'swap_station_manager',
        'SYSTEM_ADMIN',
        'HUB_MANAGER',
        'SWAP_STATION_MANAGER',
    ]
    return roles.some((role) => 
        authorizedRoles.some(authRole => authRole.toLowerCase() === role.toLowerCase())
    )
}
