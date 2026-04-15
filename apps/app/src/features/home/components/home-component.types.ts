import type { DimensionValue } from 'react-native'
import type { HomeQuickAction, HomeRideStat, HomeStation } from '../home.types'

export type HeroCardProps = {
    onPrimaryPress: () => void
    onSecondaryPress: () => void
}

export type QuickActionCardProps = {
    action: HomeQuickAction
    width: number | `${number}%`
}

export type RideStatCardProps = {
    stat: HomeRideStat
    width: DimensionValue
}

export type SectionHeadingProps = {
    eyebrow?: string
    title: string
    description?: string
}

export type StationCardProps = {
    station: HomeStation
}
