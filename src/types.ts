import { HCLColor } from 'd3-color'

export enum MessageType {
    ColorSelection,
    ScanSelection,
    ReplaceColors,
}

export interface NodeColor {
    nodeId: string
    color: RGB
}

export interface NodeColorHCL {
    nodeId: string
    color: HCLColor
}

export interface MessageColorSelection {
    nodeColors: NodeColor[]
    type: MessageType.ColorSelection
}

export interface MessageScanSelection {
    type: MessageType.ScanSelection
}

export interface MessageReplaceColors {
    type: MessageType.ReplaceColors
    nodeColors: NodeColor[]
}

export type Message =
    | MessageColorSelection
    | MessageScanSelection
    | MessageReplaceColors

export interface WindowMessage {
    data: {
        pluginMessage: Message
    }
}
