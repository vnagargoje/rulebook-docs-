import type { ComponentProps } from 'react'
import type { DimensionValue } from 'react-native'
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

export type CustomerHeroCardProps = {
    title: string
    description: string
    primaryLabel: string
    secondaryLabel: string
    onPrimaryPress: () => void
    onSecondaryPress: () => void
}

export type CustomerQuickActionCardProps = {
    action: CustomerHomeQuickAction
    width: number | `${number}%`
}

export type CustomerRideStatCardProps = {
    stat: CustomerHomeRideStat
    width: DimensionValue
}

export type CustomerStationCardProps = {
    station: CustomerHomeStation
}
