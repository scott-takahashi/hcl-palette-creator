import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled, { ThemeProvider } from 'styled-components'
import { hcl, HCLColor, rgb } from 'd3-color'
import {
    themeRefresh,
    GlobalStyles,
    Button,
    Box,
    Stack,
    Text,
} from '@patreon/studio'
// @ts-ignore
import Slider from 'react-slider'
import cloneDeep from 'lodash.clonedeep'

import { MessageType, WindowMessage, NodeColorHCL } from './types'

const StyledSlider = styled(Slider)`
    width: 100%;
    height: 16px;
`

const StyledThumb = styled.div`
    height: 24px;
    width: 24px;
    border: 1px solid #aaa;
    text-align: center;
    background-color: #fff;
    border-radius: 50%;
    margin-top: -4px;
    cursor: grab;
`

const Thumb = (props: any, _state: any) => <StyledThumb {...props} />

const StyledTrack = styled.div<any>`
    top: 0;
    border: 1px solid #999;
    bottom: 0;
    background: ${props => (props.index === 0 ? '#fff' : '#ccc')};
    border-radius: 999px;
`

const Track = (props: any, state: any) => (
    <StyledTrack {...props} index={state.index} />
)

const App: React.FC = () => {
    const [nodeColors, setNodeColors] = useState<NodeColorHCL[]>([])

    useEffect(() => {
        onmessage = ({ data: { pluginMessage: message } }: WindowMessage) => {
            switch (message?.type) {
                case MessageType.ColorSelection:
                    if (message?.nodeColors?.length) {
                        setNodeColors(
                            message?.nodeColors.map(({ color, nodeId }) => {
                                const rgbColor = rgb(
                                    color.r * 256,
                                    color.g * 256,
                                    color.b * 256,
                                )
                                return { color: hcl(rgbColor), nodeId }
                            }),
                        )
                    }
                    break
            }
        }
    }, [])

    const scanSelection = () => {
        parent.postMessage(
            { pluginMessage: { type: MessageType.ScanSelection } },
            '*',
        )
    }

    const replaceColors = () => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: MessageType.ReplaceColors,
                    nodeColors: nodeColors.map(({ nodeId, color }) => ({
                        nodeId,
                        color: {
                            r: color.rgb().r / 256,
                            g: color.rgb().g / 256,
                            b: color.rgb().b / 256,
                        },
                    })),
                },
            },
            '*',
        )
    }

    const updateHCLValue = (index: number, { h, c, l }: Partial<HCLColor>) => {
        const nodeColorsCopy = cloneDeep(nodeColors)
        if (h) {
            nodeColorsCopy[index].color.h = h
        }
        if (c) {
            nodeColorsCopy[index].color.c = c
        }
        if (l) {
            nodeColorsCopy[index].color.l = l
        }
        setNodeColors(nodeColorsCopy)
    }

    return (
        <ThemeProvider theme={themeRefresh}>
            <>
                <GlobalStyles.GlobalBaseStyles />
                <GlobalStyles.GlobalNormalizeStyles />
                <Box p={3}>
                    <Button onClick={scanSelection}>Get colors</Button>
                    <Button onClick={replaceColors}>Replace colors</Button>
                    <Box pt={2}>
                        <Stack>
                            {nodeColors.map((nodeColor, i) => {
                                return (
                                    <Stack
                                        key={`${nodeColor.color.hex()}-${i}`}
                                    >
                                        <Box
                                            backgroundColor={nodeColor.color.hex()}
                                            p={4}
                                            display={Box.Display.InlineBlock}
                                        />
                                        <Stack
                                            direction={
                                                Stack.Direction.Horizontal
                                            }
                                            fluidWidth
                                            wrap={false}
                                        >
                                            <Box>
                                                <Text>{nodeColor.color.h}</Text>
                                                <StyledSlider
                                                    defaultValue={
                                                        nodeColor.color.h
                                                    }
                                                    max={360}
                                                    onAfterChange={(
                                                        h: number,
                                                    ) =>
                                                        updateHCLValue(i, {
                                                            h,
                                                        })
                                                    }
                                                    renderTrack={Track}
                                                    renderThumb={Thumb}
                                                />
                                            </Box>
                                            <Box>
                                                <Text>{nodeColor.color.c}</Text>
                                                <StyledSlider
                                                    defaultValue={
                                                        nodeColor.color.c
                                                    }
                                                    max={100}
                                                    onAfterChange={(
                                                        c: number,
                                                    ) =>
                                                        updateHCLValue(i, {
                                                            c,
                                                        })
                                                    }
                                                    renderTrack={Track}
                                                    renderThumb={Thumb}
                                                />
                                            </Box>
                                            <Box>
                                                <Text>{nodeColor.color.l}</Text>
                                                <StyledSlider
                                                    defaultValue={
                                                        nodeColor.color.l
                                                    }
                                                    max={100}
                                                    onAfterChange={(
                                                        l: number,
                                                    ) =>
                                                        updateHCLValue(i, {
                                                            l,
                                                        })
                                                    }
                                                    renderTrack={Track}
                                                    renderThumb={Thumb}
                                                />
                                            </Box>
                                        </Stack>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </Box>
                </Box>
            </>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
