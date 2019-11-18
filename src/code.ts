import { MessageType, Message, MessageColorSelection, NodeColor } from './types'

figma.showUI(__html__, { width: 640, height: 800 })

function clone<T>(val: T): T {
    return JSON.parse(JSON.stringify(val))
}

figma.ui.onmessage = (msg: Message) => {
    switch (msg.type) {
        case MessageType.ScanSelection:
            const selectedNodesWithFill = figma.currentPage.selection

            const sortedNodes = [...selectedNodesWithFill].sort(node => -node.y)

            const selectedColors = sortedNodes
                .map(node =>
                    'fills' in node && Array.isArray(node.fills)
                        ? {
                              color: node.fills?.[0]?.color as RGB,
                              nodeId: node.id,
                          }
                        : false,
                )
                .filter(Boolean) as NodeColor[]

            const message: MessageColorSelection = {
                type: MessageType.ColorSelection,
                nodeColors: selectedColors,
            }

            figma.ui.postMessage(message)
            break

        case MessageType.ReplaceColors:
            for (const nodeColor of msg.nodeColors) {
                const node = figma.getNodeById(nodeColor.nodeId)
                if (node && 'fills' in node) {
                    const fills = clone(node.fills) as any
                    const { color } = nodeColor
                    fills[0].color.r = color.r
                    fills[0].color.g = color.g
                    fills[0].color.b = color.b
                    node.fills = fills
                }
            }
            break
    }
}
