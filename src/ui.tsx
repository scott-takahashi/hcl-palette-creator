import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { hcl, HCLColor, rgb } from 'd3-color'
import { themeRefresh, GlobalStyles, Button, Box, Stack } from '@patreon/studio'
import cloneDeep from 'lodash.clonedeep'

import { MessageType, WindowMessage, NodeColorHCL } from './types'
import { ColorEditor } from './components/ColorEditor'

const App: React.FC = () => {
    const [nodeColors, setNodeColors] = useState<NodeColorHCL[]>([])
    const [hasScanned, setHasScanned] = useState(false)

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

    useEffect(() => {
        if (!hasScanned) {
            scanSelection()
            setHasScanned(true)
        }
    }, [hasScanned])

    const bound = (value: number) => Math.max(Math.min(value, 255), 0)

    const replaceColors = () => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: MessageType.ReplaceColors,
                    nodeColors: nodeColors.map(({ nodeId, color }) => ({
                        nodeId,
                        color: {
                            r: bound(color.rgb().r / 256),
                            g: bound(color.rgb().g / 256),
                            b: bound(color.rgb().b / 256),
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
                    <Stack>
                        <Stack direction={Stack.Direction.Horizontal}>
                            <Button onClick={scanSelection}>
                                Update selection
                            </Button>
                            <Button onClick={replaceColors}>
                                Apply colors
                            </Button>
                        </Stack>
                        <Stack>
                            {nodeColors.map((nodeColor, i) => (
                                <ColorEditor
                                    hcl={nodeColor.color}
                                    key={`color-editor-${nodeColor.nodeId}`}
                                    onChange={hcl => updateHCLValue(i, hcl)}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Box>
            </>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
