export const stationTypeOptions = [
    { label: 'Swap Station', value: 'swap_station' },
    { label: 'Hub Station', value: 'hub_station' },
] as const

export type StationType = (typeof stationTypeOptions)[number]['value']
export type StationManagerRole = 'swap_manager' | 'hub_manager'
export type StationListPath = '/stations' | '/hub-stations'

export const stationManagerRoleByType: Record<StationType, StationManagerRole> = {
    swap_station: 'swap_manager',
    hub_station: 'hub_manager',
}

export const stationListPathByType: Record<StationType, StationListPath> = {
    swap_station: '/stations',
    hub_station: '/hub-stations',
}

export function getStationCreatePath(type: StationType) {
    return `${stationListPathByType[type]}/create`
}

export function getStationEditPath(type: StationType, id: string) {
    return `${stationListPathByType[type]}/edit/${id}`
}

export function getStationViewPath(type: StationType, id: string) {
    return `${stationListPathByType[type]}/${id}`
}
