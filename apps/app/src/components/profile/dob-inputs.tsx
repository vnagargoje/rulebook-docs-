import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRef, useState, useEffect } from 'react'
import { TextInput } from 'react-native'
import { Text, View } from '@/components/ui'

interface DobFieldProps {
    label: string
    value: string
    placeholder: string
    onChangeText: (v: string) => void
    onFocus?: () => void
    onBlur?: () => void
    inputRef?: React.RefObject<TextInput | null>
    flex: number
}

function DobField({
    label,
    value,
    placeholder,
    onChangeText,
    onFocus,
    onBlur,
    inputRef,
    flex,
}: DobFieldProps) {
    const [focused, setFocused] = useState(false)
    const filled = value.length > 0

    return (
        <View style={{ flex }}>
            <TextInput
                ref={inputRef}
                value={value}
                placeholder={placeholder}
                placeholderTextColor='#C4C9D4'
                keyboardType='number-pad'
                maxLength={placeholder.length}
                returnKeyType='next'
                onChangeText={onChangeText}
                onFocus={() => {
                    setFocused(true)
                    onFocus?.()
                }}
                onBlur={() => {
                    setFocused(false)
                    onBlur?.()
                }}
                style={{
                    height: 52,
                    borderRadius: 14,
                    borderWidth: focused ? 2 : 1.5,
                    borderColor: focused ? '#2563EB' : filled ? '#93C5FD' : '#E5E7EB',
                    backgroundColor: focused ? '#EFF6FF' : filled ? '#F0F7FF' : '#F9FAFB',
                    textAlign: 'center',
                    fontSize: filled ? 18 : 15,
                    fontWeight: filled ? '700' : '400',
                    color: focused ? '#1D4ED8' : filled ? '#1E40AF' : '#9CA3AF',
                }}
            />
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: '600',
                    color: focused ? '#2563EB' : '#C4C9D4',
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    marginTop: 5,
                }}>
                {label}
            </Text>
        </View>
    )
}

interface DobInputsProps {
    value: string
    onChange: (v: string) => void
}

export function DobInputs({ value, onChange }: DobInputsProps) {
    const monthRef = useRef<TextInput>(null)
    const yearRef = useRef<TextInput>(null)

    const [dd, setDd] = useState('')
    const [mm, setMm] = useState('')
    const [yyyy, setYyyy] = useState('')

    useEffect(() => {
        if (value && value.length === 10) {
            const [y, m, d] = value.split('-')
            setYyyy(y ?? '')
            setMm(m ?? '')
            setDd(d ?? '')
        }
    }, [value])

    const emit = (d: string, m: string, y: string) => {
        if (d.length === 2 && m.length === 2 && y.length === 4) {
            onChange(`${y}-${m}-${d}`)
            return
        }

        onChange('')
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <DobField
                    label='Day'
                    value={dd}
                    placeholder='DD'
                    flex={1}
                    onChangeText={(v) => {
                        const next = v.replace(/\D/g, '').slice(0, 2)
                        if (next && parseInt(next, 10) > 31) return
                        setDd(next)
                        emit(next, mm, yyyy)
                        if (next.length === 2) monthRef.current?.focus()
                    }}
                />
                <DobField
                    label='Month'
                    value={mm}
                    placeholder='MM'
                    flex={1}
                    inputRef={monthRef}
                    onChangeText={(v) => {
                        const next = v.replace(/\D/g, '').slice(0, 2)
                        if (next && parseInt(next, 10) > 12) return
                        setMm(next)
                        emit(dd, next, yyyy)
                        if (next.length === 2) yearRef.current?.focus()
                    }}
                />
                <DobField
                    label='Year'
                    value={yyyy}
                    placeholder='YYYY'
                    flex={2}
                    inputRef={yearRef}
                    onChangeText={(v) => {
                        const next = v.replace(/\D/g, '').slice(0, 4)
                        setYyyy(next)
                        emit(dd, mm, next)
                    }}
                />
            </View>
            {dd && mm && yyyy.length === 4 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }}>
                    <MaterialCommunityIcons name='check-circle' size={13} color='#16A34A' />
                    <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '500' }}>{dd}/{mm}/{yyyy}</Text>
                </View>
            )}
        </View>
    )
}
