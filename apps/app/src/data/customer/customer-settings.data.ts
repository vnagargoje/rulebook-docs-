import type { CustomerSettingsSection } from '@/types/customer/customer-settings.types'

export const customerSettingsContent = {
    title: 'Profile & Settings',
    subtitle: 'This customer workspace is locked to the light theme and keeps account essentials easy to review.',
    signOutLabel: 'Sign out',
} as const

export const getCustomerSettingsSections = (appName: string, version: string): CustomerSettingsSection[] => [
    {
        id: 'general',
        title: 'General',
        items: [
            {
                id: 'language',
                label: 'Language',
                value: 'English',
            },
            {
                id: 'theme',
                label: 'Theme',
                value: 'Light',
            },
        ],
    },
    {
        id: 'about',
        title: 'About',
        items: [
            {
                id: 'app-name',
                label: 'App name',
                value: appName,
            },
            {
                id: 'version',
                label: 'Version',
                value: version,
            },
        ],
    },
    {
        id: 'help',
        title: 'Support',
        items: [
            {
                id: 'help-center',
                label: 'Help center',
                value: 'Available from the Support tab',
            },
            {
                id: 'privacy',
                label: 'Privacy policy',
                value: 'Available on request',
            },
        ],
    },
]
