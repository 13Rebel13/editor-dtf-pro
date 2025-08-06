import React from 'react'
import { Rect, Group, Line } from 'react-konva'
import type { Background } from '../../../../shared/src/types/index.js'

interface CanvasBackgroundProps {
  background: Background
  width: number
  height: number
}

export function CanvasBackground({ background, width, height }: CanvasBackgroundProps) {
  switch (background.type) {
    case 'solid':
      return (
        <Rect
          width={width}
          height={height}
          fill={background.color}
        />
      )

    case 'gradient':
      return (
        <GradientBackground
          background={background}
          width={width}
          height={height}
        />
      )

    case 'pattern':
      return (
        <PatternBackground
          background={background}
          width={width}
          height={height}
        />
      )

    case 'texture':
    case 'image':
      return (
        <ImageBackground
          background={background}
          width={width}
          height={height}
        />
      )

    default:
      return (
        <Rect
          width={width}
          height={height}
          fill="white"
        />
      )
  }
}

function GradientBackground({ background, width, height }: { 
  background: Extract<Background, { type: 'gradient' }>, 
  width: number, 
  height: number 
}) {
  // Create linear gradient
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`
  
  // For now, use a simple two-color gradient
  const startColor = background.colors[0]?.color || '#ffffff'
  const endColor = background.colors[background.colors.length - 1]?.color || '#000000'
  
  return (
    <Rect
      width={width}
      height={height}
      fillLinearGradientStartPoint={{ x: 0, y: 0 }}
      fillLinearGradientEndPoint={{ 
        x: background.gradientType === 'linear' ? width : width / 2,
        y: background.gradientType === 'linear' ? height : height / 2
      }}
      fillLinearGradientColorStops={[0, startColor, 1, endColor]}
    />
  )
}

function PatternBackground({ background, width, height }: { 
  background: Extract<Background, { type: 'pattern' }>, 
  width: number, 
  height: number 
}) {
  const { patternType, primaryColor, secondaryColor, size } = background
  
  return (
    <Group>
      {/* Base color */}
      <Rect
        width={width}
        height={height}
        fill={secondaryColor}
      />
      
      {/* Pattern overlay */}
      {patternType === 'dots' && (
        <DotsPattern
          width={width}
          height={height}
          color={primaryColor}
          size={size}
        />
      )}
      
      {patternType === 'stripes' && (
        <StripesPattern
          width={width}
          height={height}
          color={primaryColor}
          size={size}
        />
      )}
      
      {patternType === 'checkerboard' && (
        <CheckerboardPattern
          width={width}
          height={height}
          color={primaryColor}
          size={size}
        />
      )}
    </Group>
  )
}

function DotsPattern({ width, height, color, size }: {
  width: number
  height: number
  color: string
  size: number
}) {
  const dots = []
  const spacing = size * 2
  
  for (let x = size; x < width; x += spacing) {
    for (let y = size; y < height; y += spacing) {
      dots.push(
        <circle
          key={`dot-${x}-${y}`}
          x={x}
          y={y}
          radius={size / 2}
          fill={color}
        />
      )
    }
  }
  
  return <Group>{dots}</Group>
}

function StripesPattern({ width, height, color, size }: {
  width: number
  height: number
  color: string
  size: number
}) {
  const stripes = []
  const spacing = size * 2
  
  for (let x = 0; x < width; x += spacing) {
    stripes.push(
      <Rect
        key={`stripe-${x}`}
        x={x}
        y={0}
        width={size}
        height={height}
        fill={color}
      />
    )
  }
  
  return <Group>{stripes}</Group>
}

function CheckerboardPattern({ width, height, color, size }: {
  width: number
  height: number
  color: string
  size: number
}) {
  const squares = []
  
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      const isEven = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0
      if (isEven) {
        squares.push(
          <Rect
            key={`square-${x}-${y}`}
            x={x}
            y={y}
            width={size}
            height={size}
            fill={color}
          />
        )
      }
    }
  }
  
  return <Group>{squares}</Group>
}

function ImageBackground({ background, width, height }: { 
  background: Extract<Background, { type: 'texture' | 'image' }>, 
  width: number, 
  height: number 
}) {
  // For now, just show a placeholder
  // In a real implementation, you would load the image and create a pattern
  return (
    <Group>
      <Rect
        width={width}
        height={height}
        fill="#f0f0f0"
      />
      <Line
        points={[0, 0, width, height]}
        stroke="#ddd"
        strokeWidth={1}
      />
      <Line
        points={[width, 0, 0, height]}
        stroke="#ddd"
        strokeWidth={1}
      />
    </Group>
  )
}