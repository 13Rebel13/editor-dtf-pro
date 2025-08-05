import React from 'react'
import { Settings, Type, Image, RotateCw, Move, Palette } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export function PropertiesPanel() {
  const { state, dispatch, getCurrentPlate, getFileById } = useApp()
  const currentPlate = getCurrentPlate()
  const selectedElement = state.selectedElement

  if (!currentPlate) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Propriétés
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Settings className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucune planche active</p>
          </div>
        </div>
      </div>
    )
  }

  // Trouver l'élément sélectionné
  let element = null
  let elementFile = null

  if (selectedElement.type === 'element' && selectedElement.id) {
    element = currentPlate.elements.find(e => e.id === selectedElement.id)
    if (element) {
      elementFile = getFileById(element.fileId)
    }
  }

  let textElement = null
  if (selectedElement.type === 'text' && selectedElement.id) {
    textElement = currentPlate.textElements.find(t => t.id === selectedElement.id)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Propriétés
        </h3>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto">
        {!selectedElement.id ? (
          // Aucun élément sélectionné
          <div className="p-4">
            <div className="text-center text-gray-500 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm">Sélectionnez un élément</p>
              <p className="text-xs text-gray-400 mt-1">
                Cliquez sur un élément pour modifier ses propriétés
              </p>
            </div>

            {/* Statistiques de la planche */}
            <div className="space-y-4">
              <div className="card p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Informations Planche
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">{currentPlate.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Éléments:</span>
                    <span className="font-medium">{currentPlate.elements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Textes:</span>
                    <span className="font-medium">{currentPlate.textElements.length}</span>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="space-y-2">
                <button className="btn-outline w-full !justify-center">
                  <Type className="w-4 h-4 mr-2" />
                  Ajouter du texte
                </button>
                <button className="btn-outline w-full !justify-center">
                  <Image className="w-4 h-4 mr-2" />
                  Optimiser automatiquement
                </button>
              </div>
            </div>
          </div>
        ) : element ? (
          // Élément image sélectionné
          <div className="p-4 space-y-4">
            <div className="card p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Élément Image
              </h4>
              
              {elementFile && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Fichier:</p>
                  <p className="text-sm font-medium truncate">{elementFile.originalName}</p>
                </div>
              )}

              {/* Position */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Move className="w-3 h-3 mr-1" />
                  Position
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">X (px)</label>
                    <input
                      type="number"
                      className="input-field !py-1 !text-sm"
                      value={Math.round(element.position.x)}
                      onChange={(e) => {
                        dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: {
                            plateId: currentPlate.id,
                            elementId: element.id,
                            updates: {
                              position: {
                                x: parseInt(e.target.value) || 0,
                                y: element.position.y
                              }
                            }
                          }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Y (px)</label>
                    <input
                      type="number"
                      className="input-field !py-1 !text-sm"
                      value={Math.round(element.position.y)}
                      onChange={(e) => {
                        dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: {
                            plateId: currentPlate.id,
                            elementId: element.id,
                            updates: {
                              position: {
                                x: element.position.x,
                                y: parseInt(e.target.value) || 0
                              }
                            }
                          }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Dimensions</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">Largeur (px)</label>
                    <input
                      type="number"
                      className="input-field !py-1 !text-sm"
                      value={Math.round(element.dimensions.width)}
                      onChange={(e) => {
                        const newWidth = parseInt(e.target.value) || 0
                        const updates: any = {
                          dimensions: {
                            width: newWidth,
                            height: element.keepRatio 
                              ? (newWidth * element.dimensions.height) / element.dimensions.width
                              : element.dimensions.height
                          }
                        }
                        
                        dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: {
                            plateId: currentPlate.id,
                            elementId: element.id,
                            updates
                          }
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Hauteur (px)</label>
                    <input
                      type="number"
                      className="input-field !py-1 !text-sm"
                      value={Math.round(element.dimensions.height)}
                      onChange={(e) => {
                        const newHeight = parseInt(e.target.value) || 0
                        const updates: any = {
                          dimensions: {
                            width: element.keepRatio 
                              ? (newHeight * element.dimensions.width) / element.dimensions.height
                              : element.dimensions.width,
                            height: newHeight
                          }
                        }
                        
                        dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: {
                            plateId: currentPlate.id,
                            elementId: element.id,
                            updates
                          }
                        })
                      }}
                    />
                  </div>
                </div>
                <label className="flex items-center mt-2 text-sm">
                  <input
                    type="checkbox"
                    checked={element.keepRatio}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_ELEMENT',
                        payload: {
                          plateId: currentPlate.id,
                          elementId: element.id,
                          updates: { keepRatio: e.target.checked }
                        }
                      })
                    }}
                    className="mr-2"
                  />
                  Conserver le ratio
                </label>
              </div>

              {/* Rotation */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <RotateCw className="w-3 h-3 mr-1" />
                  Rotation
                </p>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={element.rotation}
                  onChange={(e) => {
                    dispatch({
                      type: 'UPDATE_ELEMENT',
                      payload: {
                        plateId: currentPlate.id,
                        elementId: element.id,
                        updates: { rotation: parseInt(e.target.value) }
                      }
                    })
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°</span>
                  <span>{element.rotation}°</span>
                  <span>360°</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="btn-outline w-full !justify-center">
                Dupliquer
              </button>
              <button className="btn-outline w-full !justify-center text-red-600 hover:!bg-red-50">
                Supprimer
              </button>
            </div>
          </div>
        ) : textElement ? (
          // Élément texte sélectionné
          <div className="p-4 space-y-4">
            <div className="card p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Élément Texte
              </h4>

              {/* Contenu */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Texte
                </label>
                <textarea
                  className="input-field !py-2 resize-none"
                  rows={3}
                  value={textElement.content}
                  onChange={(e) => {
                    dispatch({
                      type: 'UPDATE_TEXT_ELEMENT',
                      payload: {
                        plateId: currentPlate.id,
                        textElementId: textElement.id,
                        updates: { content: e.target.value }
                      }
                    })
                  }}
                />
              </div>

              {/* Style */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className="text-xs text-gray-600">Taille</label>
                  <input
                    type="number"
                    className="input-field !py-1 !text-sm"
                    value={textElement.fontSize}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_TEXT_ELEMENT',
                        payload: {
                          plateId: currentPlate.id,
                          textElementId: textElement.id,
                          updates: { fontSize: parseInt(e.target.value) || 12 }
                        }
                      })
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Couleur</label>
                  <input
                    type="color"
                    className="input-field !py-1 !px-2 !text-sm"
                    value={textElement.color}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_TEXT_ELEMENT',
                        payload: {
                          plateId: currentPlate.id,
                          textElementId: textElement.id,
                          updates: { color: e.target.value }
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}