import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg'

import { Text } from '@/components/ui'

type Props = {
    percent: number
    size?: number
    strokeWidth?: number
}

function getSocColor(p: number) {
    if (p > 60) return '#34D399'
    if (p > 25) return '#F59E0B'
    return '#EF4444'
}

function getBatteryIcon(p: number): 'battery-high' | 'battery-medium' | 'battery-low' | 'battery-alert' {
    if (p > 60) return 'battery-high'
    if (p > 25) return 'battery-medium'
    if (p > 10) return 'battery-low'
    return 'battery-alert'
}

export function CircularSoc({ percent, size = 80, strokeWidth = 8 }: Props) {
    const r = (size - strokeWidth) / 2
    const circ = 2 * Math.PI * r
    const clamped = Math.min(100, Math.max(0, percent))
    const filled = circ * (clamped / 100)
    const color = getSocColor(clamped)

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <Defs>
                    <RadialGradient id='glow' cx='50%' cy='50%' r='50%'>
                        <Stop offset='0%' stopColor={color} stopOpacity={0.15} />
                        <Stop offset='100%' stopColor={color} stopOpacity={0} />
                    </RadialGradient>
                </Defs>
                {/* Glow fill */}
                <Circle cx={size / 2} cy={size / 2} r={r - 2} fill='url(#glow)' />
                {/* Track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke='#1E293B'
                    strokeWidth={strokeWidth}
                    fill='none'
                />
                {/* Progress arc */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill='none'
                    strokeDasharray={`${filled} ${circ - filled}`}
                    strokeLinecap='round'
                    rotation='-90'
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            {/* Overlaid icon + text — avoids SVG Text issues */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: size,
                    height: size,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <MaterialCommunityIcons name={getBatteryIcon(clamped)} size={size * 0.26} color={color} />
                <Text
                    style={{
                        color,
                        fontSize: size * 0.19,
                        fontWeight: '900',
                        lineHeight: size * 0.22,
                        letterSpacing: -0.5,
                    }}>
                    {Math.round(clamped)}%
                </Text>
            </View>
        </View>
    )
}
