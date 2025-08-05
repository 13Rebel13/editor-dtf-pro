import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva'
import { useApp } from '../../contexts/AppContext'
import { PLATE_DIMENSIONS, BackgroundType, applyScale } from '@dtf-editor/shared'
import { Grid, ZoomIn, ZoomOut, Maximize } from 'lucide-react'

export function CanvasArea() {
  const { state, dispatch, getCurrentPlate } = useApp()
  const stageRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [zoom, setZoom] = useState(1)

  const currentPlate = getCurrentPlate()

  // Adapter la taille du stage au conteneur
  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current && currentPlate) {
        const container = containerRef.current
        const containerWidth = container.clientWidth - 40 // marges
        const containerHeight = container.clientHeight - 40

        const plateDimensions = PLATE_DIMENSIONS[currentPlate.format]
        const plateRatio = plateDimensions.width / plateDimensions.height

        let stageWidth = containerWidth
        let stageHeight = stageWidth / plateRatio

        if (stageHeight > containerHeight) {
          stageHeight = containerHeight
          stageWidth = stageHeight * plateRatio
        }

        setStageSize({ width: stageWidth, height: stageHeight })
      }
    }

    updateStageSize()
    window.addEventListener('resize', updateStageSize)
    return () => window.removeEventListener('resize', updateStageSize)
  }, [currentPlate])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1))
  }

  const handleFitToWindow = () => {
    setZoom(1)
  }

  const handleBackgroundChange = () => {
    if (!currentPlate) return

    const backgrounds = [
      BackgroundType.GRID_LIGHT,
      BackgroundType.GRID_DARK,
      BackgroundType.DOTS
    ]
    
    const currentIndex = backgrounds.indexOf(currentPlate.backgroundType)
    const nextIndex = (currentIndex + 1) % backgrounds.length
    
    dispatch({
      type: 'SET_PLATE_BACKGROUND',
      payload: {
        plateId: currentPlate.id,
        backgroundType: backgrounds[nextIndex]
      }
    })
  }

  const getBackgroundClass = (backgroundType: BackgroundType): string => {
    switch (backgroundType) {
      case BackgroundType.GRID_LIGHT:
        return 'plate-background-grid'
      case BackgroundType.GRID_DARK:
        return 'plate-background-grid-dark'
      case BackgroundType.DOTS:
        return 'plate-background-dots'
      default:
        return ''
    }
  }

  if (!currentPlate) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <Grid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Aucune planche sélectionnée</p>
          <p className="text-sm">Créez ou sélectionnez une planche pour commencer</p>
        </div>
      </div>
    )
  }

  const plateDimensions = PLATE_DIMENSIONS[currentPlate.format]

  return (
    <div className="flex-1 flex flex-col">
      {/* Barre d'outils du canvas */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Planche {currentPlate.format} ({plateDimensions.width} × {plateDimensions.height} px)
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Éléments:</span>
            <span className="text-xs font-medium">
              {currentPlate.elements.length + currentPlate.textElements.length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Contrôles zoom */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-gray-100"
              title="Zoom arrière"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-gray-100"
              title="Zoom avant"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleFitToWindow}
              className="p-1 rounded hover:bg-gray-100"
              title="Ajuster à la fenêtre"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          {/* Changement de fond */}
          <button
            onClick={handleBackgroundChange}
            className="p-1 rounded hover:bg-gray-100"
            title="Changer le fond"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone de canvas */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center p-4"
      >
        <div 
          className={`canvas-container ${getBackgroundClass(currentPlate.backgroundType)}`}
          style={{
            width: stageSize.width * zoom,
            height: stageSize.height * zoom,
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            scaleX={stageSize.width / plateDimensions.width}
            scaleY={stageSize.height / plateDimensions.height}
          >
            <Layer>
              {/* Fond de la planche */}
              <Rect
                x={0}
                y={0}
                width={plateDimensions.width}
                height={plateDimensions.height}
                fill="white"
                stroke="#e5e7eb"
                strokeWidth={2}
              />

              {/* Éléments de la planche */}
              {currentPlate.elements.map((element) => {
                const file = state.uploadedFiles.find(f => f.id === element.fileId)
                if (!file) return null

                return (
                  <Rect
                    key={element.id}
                    x={element.position.x}
                    y={element.position.y}
                    width={element.dimensions.width}
                    height={element.dimensions.height}
                    fill="#3b82f6"
                    opacity={0.7}
                    stroke="#1d4ed8"
                    strokeWidth={1}
                    rotation={element.rotation}
                    draggable
                    onDragEnd={(e) => {
                      dispatch({
                        type: 'UPDATE_ELEMENT',
                        payload: {
                          plateId: currentPlate.id,
                          elementId: element.id,
                          updates: {
                            position: {
                              x: e.target.x(),
                              y: e.target.y()
                            }
                          }
                        }
                      })
                    }}
                  />
                )
              })}

              {/* Éléments de texte */}
              {currentPlate.textElements.map((textElement) => (
                <Text
                  key={textElement.id}
                  x={textElement.position.x}
                  y={textElement.position.y}
                  text={textElement.content}
                  fontSize={textElement.fontSize}
                  fontFamily={textElement.fontFamily}
                  fill={textElement.color}
                  rotation={textElement.rotation}
                  draggable
                  onDragEnd={(e) => {
                    dispatch({
                      type: 'UPDATE_TEXT_ELEMENT',
                      payload: {
                        plateId: currentPlate.id,
                        textElementId: textElement.id,
                        updates: {
                          position: {
                            x: e.target.x(),
                            y: e.target.y()
                          }
                        }
                      }
                    })
                  }}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  )
}