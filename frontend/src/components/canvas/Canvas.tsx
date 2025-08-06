import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Group } from 'react-konva'
import { useStore } from '../../store/useStore'
import { CanvasBackground } from './CanvasBackground'
import { CanvasGrid } from './CanvasGrid'
import { CanvasElement } from './CanvasElement'
import { CanvasTransformer } from './CanvasTransformer'
import type { KonvaEventObject } from 'konva/lib/Node'

export function Canvas() {
  const { 
    currentProject, 
    canvas, 
    selectElements, 
    updateElement,
    setZoom,
    setPan
  } = useStore()
  
  const stageRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })

  // Update stage size when container resizes
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current
        setStageSize({
          width: offsetWidth,
          height: offsetHeight
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-dtf-muted-foreground">
          <p>Aucun projet chargé</p>
        </div>
      </div>
    )
  }

  const { format, zoom = 1, panX = 0, panY = 0 } = currentProject

  // Calculate canvas dimensions based on format and zoom
  const canvasWidth = format.width * 0.1 * zoom // Scale down for display
  const canvasHeight = format.height * 0.1 * zoom
  
  // Center the canvas in the stage
  const canvasX = (stageSize.width - canvasWidth) / 2 + panX
  const canvasY = (stageSize.height - canvasHeight) / 2 + panY

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // If clicking on empty space, deselect all
    if (e.target === e.target.getStage()) {
      selectElements([])
    }
  }

  const handleElementClick = (elementId: string, e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    
    if (e.evt.ctrlKey || e.evt.metaKey) {
      // Multi-select with Ctrl/Cmd
      const selected = canvas.selectedElements
      if (selected.includes(elementId)) {
        selectElements(selected.filter(id => id !== elementId))
      } else {
        selectElements([...selected, elementId])
      }
    } else {
      // Single select
      selectElements([elementId])
    }
  }

  const handleElementDragEnd = (elementId: string, e: KonvaEventObject<DragEvent>) => {
    const node = e.target
    updateElement(elementId, {
      x: node.x(),
      y: node.y()
    })
  }

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    
    const stage = stageRef.current
    if (!stage) return

    const scaleBy = 1.1
    const oldScale = zoom
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    }

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy
    const clampedScale = Math.max(0.1, Math.min(5, newScale))
    
    setZoom(clampedScale)
    
    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / clampedScale) * clampedScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / clampedScale) * clampedScale
    }
    
    setPan(newPos.x, newPos.y)
  }

  // Get all elements from all layers
  const allElements = currentProject.layers
    .filter(layer => layer.visible)
    .flatMap(layer => layer.elements)
    .filter(element => element.visible)

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-dtf-muted"
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onClick={handleStageClick}
        onWheel={handleWheel}
        draggable={canvas.tool === 'pan'}
        onDragEnd={(e) => {
          setPan(e.target.x(), e.target.y())
        }}
      >
        {/* Background layer */}
        <Layer>
          {/* Canvas background */}
          <Group x={canvasX} y={canvasY}>
            <Rect
              width={canvasWidth}
              height={canvasHeight}
              fill="white"
              stroke="#ddd"
              strokeWidth={1}
              shadowColor="rgba(0,0,0,0.1)"
              shadowOffset={{ x: 2, y: 2 }}
              shadowBlur={10}
            />
            
            {/* Background pattern/image */}
            <CanvasBackground 
              background={currentProject.background}
              width={canvasWidth}
              height={canvasHeight}
            />
            
            {/* Grid */}
            {currentProject.gridVisible && (
              <CanvasGrid
                width={canvasWidth}
                height={canvasHeight}
                spacing={20 * zoom}
                color="rgba(0,0,0,0.1)"
              />
            )}
          </Group>
        </Layer>

        {/* Content layer */}
        <Layer>
          <Group x={canvasX} y={canvasY}>
            {allElements.map(element => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={canvas.selectedElements.includes(element.id)}
                onClick={(e) => handleElementClick(element.id, e)}
                onDragEnd={(e) => handleElementDragEnd(element.id, e)}
                scale={zoom}
              />
            ))}
            
            {/* Transformer for selected elements */}
            {canvas.selectedElements.length > 0 && (
              <CanvasTransformer
                selectedElements={canvas.selectedElements}
                onTransform={(elementId, attrs) => {
                  updateElement(elementId, attrs)
                }}
                scale={zoom}
              />
            )}
          </Group>
        </Layer>
      </Stage>

      {/* Canvas controls overlay */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-dtf-secondary-700 shadow-medium">
          {Math.round(zoom * 100)}%
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-dtf-secondary-700 shadow-medium">
          {format.name} • {format.widthCm}×{format.heightCm}cm
        </div>
      </div>

      {/* Center canvas button */}
      <button
        onClick={() => {
          setZoom(1)
          setPan(0, 0)
        }}
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-dtf-secondary-700 shadow-medium hover:bg-white transition-colors"
        title="Centrer et ajuster le zoom"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
    </div>
  )
}