export type CustomerSettingsItem = {
    id: string
    label: string
    value?: string
}

export type CustomerSettingsSection = {
    id: string
    title: string
    items: CustomerSettingsItem[]
}
