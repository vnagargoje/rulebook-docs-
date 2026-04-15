import type { SvgProps } from 'react-native-svg'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export function Booking( { color = '#000', ...props }: SvgProps ) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox='0 0 24 24'
            fill='none'
            {...props}>
            <Path
                d='M7.2 2.4a1.2 1.2 0 0 1 1.2 1.2V4.8h7.2V3.6a1.2 1.2 0 1 1 2.4 0V4.8h.6A2.4 2.4 0 0 1 21 7.2v11.4a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 18.6V7.2a2.4 2.4 0 0 1 2.4-2.4H6V3.6a1.2 1.2 0 0 1 1.2-1.2Zm11.4 8.4H5.4v7.8h13.2v-7.8Zm-10.8 2.4a1.2 1.2 0 1 1 0 2.4H9a1.2 1.2 0 0 1 0-2.4H7.8Zm4.8 0a1.2 1.2 0 1 1 0 2.4H13.8a1.2 1.2 0 0 1 0-2.4H12.6Zm6-6H5.4v1.2h13.2V7.2Z'
                fill={color}
            />
        </Svg>
    )
}
