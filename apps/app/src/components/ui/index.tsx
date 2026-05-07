import Svg from 'react-native-svg'
import { withUniwind } from 'uniwind'

export * from './button'
export * from './checkbox'
export { default as colors } from './colors'
export * from './confirm-dialog'
export * from './focus-aware-status-bar'
export * from './image'
export * from './input'
export * from './list'
export * from './modal'
export * from './progress-bar'
export * from './select'
export * from './screen-loader'
export * from './text'
export * from './utils'
export * from './qr-scanner'

import {
    ActivityIndicator as RNActivityIndicator,
    Pressable as RNPressable,
    ScrollView as RNScrollView,
    TouchableOpacity as RNTouchableOpacity,
    View as RNView,
} from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

export const View = withUniwind(RNView)
export const Pressable = withUniwind(RNPressable)
export const ScrollView = withUniwind(RNScrollView)
export const TouchableOpacity = withUniwind(RNTouchableOpacity)
export const ActivityIndicator = withUniwind(RNActivityIndicator)
export const SafeAreaView = withUniwind(RNSafeAreaView)

export const StyledSvg = withUniwind(Svg)
