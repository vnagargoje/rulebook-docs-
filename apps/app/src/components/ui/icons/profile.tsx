import type { SvgProps } from 'react-native-svg'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export function Profile( { color = '#000', ...props }: SvgProps ) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox='0 0 24 24'
            fill='none'
            {...props}>
            <Path
                d='M12 2.4a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Zm0 12.6c4.693 0 8.7 2.868 8.7 5.4 0 .663-.537 1.2-1.2 1.2H4.5a1.2 1.2 0 0 1-1.2-1.2c0-2.532 4.007-5.4 8.7-5.4Z'
                fill={color}
            />
        </Svg>
    )
}
