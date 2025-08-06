import React, { useRef, useEffect } from 'react'
import { Transformer } from 'react-konva'
import Konva from 'konva'

interface CanvasTransformerProps {
  selectedElements: string[]
  onTransform: (elementId: string, attrs: any) => void
  scale: number
}

export function CanvasTransformer({ 
  selectedElements, 
  onTransform, 
  scale 
}: CanvasTransformerProps) {
  const transformerRef = useRef<any>(null)

  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return

    const stage = transformer.getStage()
    if (!stage) return

    // Find nodes by their IDs
    const nodes: Konva.Node[] = []
    selectedElements.forEach(elementId => {
      const node = stage.findOne(`#${elementId}`)
      if (node) {
        nodes.push(node)
      }
    })

    transformer.nodes(nodes)
    transformer.getLayer()?.batchDraw()
  }, [selectedElements])

  const handleTransformEnd = (e: any) => {
    const node = e.target
    if (!node) return

    // Get the element ID from the node
    const elementId = node.id()
    if (!elementId) return

    // Get the transformed attributes
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    
    onTransform(elementId, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX,
      scaleY,
      width: node.width() * scaleX,
      height: node.height() * scaleY,
    })

    // Reset scale to 1 since we updated width/height
    node.scaleX(1)
    node.scaleY(1)
  }

  if (selectedElements.length === 0) {
    return null
  }

  return (
    <Transformer
      ref={transformerRef}
      onTransformEnd={handleTransformEnd}
      boundBoxFunc={(oldBox, newBox) => {
        // Limit resize to minimum size
        const minSize = 5 / scale // Minimum 5px at current zoom
        if (newBox.width < minSize || newBox.height < minSize) {
          return oldBox
        }
        return newBox
      }}
      // Styling
      borderStroke="#0ea5e9"
      borderStrokeWidth={2 / scale}
      borderDash={[4 / scale, 4 / scale]}
      anchorStroke="#0ea5e9"
      anchorStrokeWidth={1 / scale}
      anchorFill="white"
      anchorSize={8 / scale}
      rotateAnchorOffset={20 / scale}
      enabledAnchors={[
        'top-left',
        'top-center', 
        'top-right',
        'middle-right',
        'bottom-right',
        'bottom-center',
        'bottom-left',
        'middle-left'
      ]}
    />
  )
}