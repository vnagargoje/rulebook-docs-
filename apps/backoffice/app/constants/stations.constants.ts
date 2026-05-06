export const stationTypeOptions = [
    { label: 'Swap Station', value: 'swap_station' },
    { label: 'Hub Station', value: 'hub_station' },
] as const

export type StationType = (typeof stationTypeOptions)[number]['value']
export type StationManagerRole = 'swap_manager' | 'hub_manager'

export const stationManagerRoleByType: Record<StationType, StationManagerRole> = {
    swap_station: 'swap_manager',
    hub_station: 'hub_manager',
}
