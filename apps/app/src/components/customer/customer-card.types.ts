import type { DimensionValue } from 'react-native'
import type { CustomerHomeQuickAction, CustomerHomeRideStat, CustomerHomeStation } from '@/types/customer/customer-home.types'

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
