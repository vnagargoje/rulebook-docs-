export type SelectOption = {
    label: string
    value: string
}

export interface BaseFieldProps {
    control: any
    name: string
    label: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
}
