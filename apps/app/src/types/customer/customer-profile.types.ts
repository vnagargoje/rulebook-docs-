import type { ComponentProps } from 'react'
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export type CustomerProfileItem = {
    id: string
    label: string
    value: string
    iconName: ComponentProps<typeof MaterialCommunityIcons>['name']
}

export type CustomerProfileSection = {
    id: string
    title: string
    items: CustomerProfileItem[]
}

export type CustomerProfileHeroCardProps = {
    eyebrow: string
    title: string
    description: string
    statusLabel: string
    phoneLabel: string
    phoneValue: string
}

export type CustomerProfileSectionCardProps = {
    section: CustomerProfileSection
}
