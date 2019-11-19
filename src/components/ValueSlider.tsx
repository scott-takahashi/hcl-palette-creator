import React from 'react'
import styled from 'styled-components'

// @ts-ignore
import Slider from 'react-slider'
import { Stack, Text } from '@patreon/studio'

interface Props {
    initialValue: number
    max?: number
    min?: number
    onChange: (v: number) => void
    value: number
}

const StyledSlider = styled(Slider)`
    width: 100%;
    height: 12px;
`

const StyledThumb = styled.div`
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #aaa;
    box-sizing: border-box;
    cursor: grab;
    height: 24px;
    margin-top: -6px;
    text-align: center;
    width: 24px;
`

const Thumb = (props: any, _state: any) => <StyledThumb {...props} />

const StyledTrack = styled.div<any>`
    top: 0;
    border: 1px solid #ccc;
    bottom: 0;
    background: ${props => (props.index === 0 ? '#fff' : '#eee')};
    border-radius: 999px;
`

const Track = (props: any, state: any) => (
    <StyledTrack {...props} index={state.index} />
)

export const ValueSlider: React.FC<Props> = ({
    initialValue = 0,
    max = 100,
    min = 0,
    onChange,
    value,
}) => {
    return (
        <Stack spacing={Stack.Spacing.Sm}>
            <Text>{value}</Text>
            <StyledSlider
                defaultValue={initialValue}
                max={max}
                min={min}
                onChange={onChange}
                renderThumb={Thumb}
                renderTrack={Track}
            />
        </Stack>
    )
}
