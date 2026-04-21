import type { ComponentProps } from 'react'
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export type CustomerBookingStep = {
    id: string
    iconName: ComponentProps<typeof MaterialCommunityIcons>['name']
    title: string
    description: string
}
