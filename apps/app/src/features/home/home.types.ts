export type HomeQuickAction = {
    id: string
    title: string
    description: string
    iconLabel: string
    accentClassName: string
}

export type HomeRideStat = {
    id: string
    label: string
    value: string
    hint: string
}

export type HomeStation = {
    id: string
    name: string
    distance: string
    availability: string
    eta: string
}
