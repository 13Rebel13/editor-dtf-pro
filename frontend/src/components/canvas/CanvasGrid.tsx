import React from 'react'
import { Group, Line } from 'react-konva'

interface CanvasGridProps {
  width: number
  height: number
  spacing: number
  color: string
}

export function CanvasGrid({ width, height, spacing, color }: CanvasGridProps) {
  const lines = []

  // Vertical lines
  for (let x = 0; x <= width; x += spacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, height]}
        stroke={color}
        strokeWidth={0.5}
      />
    )
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, width, y]}
        stroke={color}
        strokeWidth={0.5}
      />
    )
  }

  return <Group>{lines}</Group>
}