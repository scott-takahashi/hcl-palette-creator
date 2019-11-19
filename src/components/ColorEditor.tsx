import React, { useState, useEffect } from 'react'
import { HCLColor } from 'd3-color'
import hclToRgb from '@fantasy-color/hcl-to-rgb'
import { Box, Stack, Text } from '@patreon/studio'
import { ValueSlider } from './ValueSlider'

interface Props {
    hcl: HCLColor
    onChange: (hcl: Partial<HCLColor>) => void
}

const roundValue = (value: number) => Math.round(value * 10) / 10

const textColor = (value: number) =>
    value < 0 || value > 255 ? Text.Color.Error : Text.Color.Gray1

export const ColorEditor: React.FC<Props> = ({ hcl, onChange }: Props) => {
    const [initialHCL, setInitialHCL] = useState<HCLColor>()

    useEffect(() => {
        if (!initialHCL) {
            setInitialHCL(hcl)
        }
    }, [hcl, initialHCL])

    const rgb = hclToRgb({ hue: hcl.h, chroma: hcl.c, luminance: hcl.l })

    return (
        <Stack>
            <Stack direction={Stack.Direction.Horizontal}>
                <Box
                    backgroundColor={hcl.hex()}
                    cornerRadius={Box.CornerRadius.Default}
                    p={5}
                    display={Box.Display.InlineBlock}
                />
                <Box>
                    <Text color={textColor(rgb.red)}>r: {rgb.red}</Text>
                    <br />
                    <Text color={textColor(rgb.green)}>g: {rgb.green}</Text>
                    <br />
                    <Text color={textColor(rgb.blue)}>b: {rgb.blue}</Text>
                </Box>
            </Stack>
            <Stack
                direction={Stack.Direction.Horizontal}
                fluidWidth
                wrap={false}
            >
                {initialHCL && (
                    <ValueSlider
                        initialValue={initialHCL.h}
                        max={360}
                        onChange={h =>
                            onChange({
                                h,
                            })
                        }
                        value={roundValue(hcl.h)}
                    />
                )}
                {initialHCL && (
                    <ValueSlider
                        initialValue={initialHCL.c}
                        onChange={c =>
                            onChange({
                                c,
                            })
                        }
                        value={roundValue(hcl.c)}
                    />
                )}
                {initialHCL && (
                    <ValueSlider
                        initialValue={initialHCL.l}
                        onChange={l =>
                            onChange({
                                l,
                            })
                        }
                        value={roundValue(hcl.l)}
                    />
                )}
            </Stack>
        </Stack>
    )
}
