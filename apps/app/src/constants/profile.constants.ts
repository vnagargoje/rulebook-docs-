export const PROFILE_GENDERS = ['male', 'female', 'other'] as const

export type ProfileGender = (typeof PROFILE_GENDERS)[number]

export const PROFILE_GENDER_OPTIONS: Array<{
    label: string
    value: ProfileGender
    icon: 'gender-male' | 'gender-female' | 'gender-non-binary'
}> = [
    { label: 'Male', value: 'male', icon: 'gender-male' },
    { label: 'Female', value: 'female', icon: 'gender-female' },
    { label: 'Other', value: 'other', icon: 'gender-non-binary' },
]

export const PROFILE_FORM_DEFAULT_VALUES = {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
} as const
