import { useCallback } from 'react'
import { Uniwind } from 'uniwind'

const SELECTED_THEME = 'SELECTED_THEME'
export type ColorSchemeType = 'light'

export function useSelectedTheme() {
    const setSelectedTheme = useCallback((_theme: ColorSchemeType) => {
        Uniwind.setTheme('light')
    }, [])

    const selectedTheme: ColorSchemeType = 'light'
    return { selectedTheme, setSelectedTheme } as const
}

export function loadSelectedTheme() {
    void SELECTED_THEME
    Uniwind.setTheme('light')
}
