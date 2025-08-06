import React from 'react'
import { Group, Rect, Text, Image as KonvaImage, Circle, RegularPolygon } from 'react-konva'
import type { CanvasElement as CanvasElementType } from '@graphite-dtf-fusion/shared'
import type { KonvaEventObject } from 'konva/lib/Node'

interface CanvasElementProps {
  element: CanvasElementType
  isSelected: boolean
  onClick: (e: KonvaEventObject<MouseEvent>) => void
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void
  scale: number
}

export function CanvasElement({ 
  element, 
  isSelected, 
  onClick, 
  onDragEnd, 
  scale 
}: CanvasElementProps) {
  const commonProps = {
    x: element.x,
    y: element.y,
    scaleX: element.scaleX,
    scaleY: element.scaleY,
    rotation: element.rotation,
    opacity: element.opacity,
    draggable: !element.locked,
    onClick,
    onDragEnd,
    onTap: onClick, // For touch devices
  }

  const selectionProps = isSelected ? {
    stroke: '#0ea5e9',
    strokeWidth: 2 / scale, // Adjust stroke width based on zoom
    strokeScaleEnabled: false,
  } : {}

  return (
    <Group>
      {element.type === 'text' && (
        <TextElement 
          element={element} 
          commonProps={commonProps}
          selectionProps={selectionProps}
        />
      )}
      
      {element.type === 'image' && (
        <ImageElement 
          element={element} 
          commonProps={commonProps}
          selectionProps={selectionProps}
        />
      )}
      
      {element.type === 'shape' && (
        <ShapeElement 
          element={element} 
          commonProps={commonProps}
          selectionProps={selectionProps}
        />
      )}
      
      {element.type === 'group' && (
        <GroupElement 
          element={element} 
          commonProps={commonProps}
          selectionProps={selectionProps}
          scale={scale}
        />
      )}
    </Group>
  )
}

function TextElement({ 
  element, 
  commonProps, 
  selectionProps 
}: { 
  element: Extract<CanvasElementType, { type: 'text' }>,
  commonProps: any,
  selectionProps: any
}) {
  return (
    <Text
      {...commonProps}
      {...selectionProps}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fontStyle={element.fontStyle}
      fontVariant={element.fontWeight}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth || 0}
      align={element.align}
      verticalAlign={element.verticalAlign}
      lineHeight={element.lineHeight}
      letterSpacing={element.letterSpacing}
      padding={element.padding}
      width={element.width}
      height={element.height}
    />
  )
}

function ImageElement({ 
  element, 
  commonProps, 
  selectionProps 
}: { 
  element: Extract<CanvasElementType, { type: 'image' }>,
  commonProps: any,
  selectionProps: any
}) {
  const [image, setImage] = React.useState<HTMLImageElement | null>(null)

  React.useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImage(img)
    img.src = element.src
  }, [element.src])

  if (!image) {
    // Show placeholder while loading
    return (
      <Rect
        {...commonProps}
        {...selectionProps}
        width={element.width}
        height={element.height}
        fill="#f0f0f0"
        stroke="#ddd"
        strokeWidth={1}
      />
    )
  }

  return (
    <KonvaImage
      {...commonProps}
      {...selectionProps}
      image={image}
      width={element.width}
      height={element.height}
    />
  )
}

function ShapeElement({ 
  element, 
  commonProps, 
  selectionProps 
}: { 
  element: Extract<CanvasElementType, { type: 'shape' }>,
  commonProps: any,
  selectionProps: any
}) {
  const { shapeType, fill, stroke, strokeWidth, cornerRadius, sides } = element

  switch (shapeType) {
    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          {...selectionProps}
          width={element.width}
          height={element.height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth || 0}
          cornerRadius={cornerRadius || 0}
        />
      )

    case 'circle':
      const radius = Math.min(element.width, element.height) / 2
      return (
        <Circle
          {...commonProps}
          {...selectionProps}
          radius={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth || 0}
        />
      )

    case 'ellipse':
      return (
        <Rect // Konva doesn't have built-in ellipse, use rect for now
          {...commonProps}
          {...selectionProps}
          width={element.width}
          height={element.height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth || 0}
          cornerRadius={Math.min(element.width, element.height) / 2}
        />
      )

    case 'polygon':
      return (
        <RegularPolygon
          {...commonProps}
          {...selectionProps}
          sides={sides || 6}
          radius={Math.min(element.width, element.height) / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth || 0}
        />
      )

    case 'star':
      return (
        <RegularPolygon
          {...commonProps}
          {...selectionProps}
          sides={sides || 5}
          radius={Math.min(element.width, element.height) / 2}
          innerRadius={Math.min(element.width, element.height) / 4}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth || 0}
        />
      )

    default:
      return (
        <Rect
          {...commonProps}
          {...selectionProps}
          width={element.width}
          height={element.height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth || 0}
        />
      )
  }
}

function GroupElement({ 
  element, 
  commonProps, 
  selectionProps,
  scale 
}: { 
  element: Extract<CanvasElementType, { type: 'group' }>,
  commonProps: any,
  selectionProps: any,
  scale: number
}) {
  return (
    <Group {...commonProps} {...selectionProps}>
      {element.children.map(child => (
        <CanvasElement
          key={child.id}
          element={child}
          isSelected={false} // Group children are not individually selected
          onClick={() => {}} // Group handles clicks
          onDragEnd={() => {}} // Group handles drag
          scale={scale}
        />
      ))}
    </Group>
  )
}