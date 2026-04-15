import type { ComponentProps } from 'react'
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export type CustomerHomeQuickAction = {
    id: string
    title: string
    description: string
    iconName: ComponentProps<typeof MaterialCommunityIcons>['name']
    iconColor: string
    accentClassName: string
}

export type CustomerHomeRideStat = {
    id: string
    label: string
    value: string
    hint: string
}

export type CustomerHomeStation = {
    id: string
    name: string
    distance: string
    availability: string
    eta: string
    statusLabel: string
}
