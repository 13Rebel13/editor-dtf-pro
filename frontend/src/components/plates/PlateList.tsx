import React from 'react'
import { Eye, Trash2, Copy, MoreVertical } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { PlateFormat } from '@dtf-editor/shared'

export function PlateList() {
  const { state, dispatch, getPlateStats } = useApp()

  const handleSelectPlate = (plateId: string) => {
    dispatch({
      type: 'SET_CURRENT_PLATE',
      payload: plateId
    })
  }

  const handleClearPlate = (plateId: string) => {
    if (confirm('Êtes-vous sûr de vouloir vider cette planche ?')) {
      dispatch({
        type: 'CLEAR_PLATE',
        payload: plateId
      })
    }
  }

  const getFormatLabel = (format: PlateFormat): string => {
    switch (format) {
      case PlateFormat.LARGE:
        return '55 × 100 cm'
      case PlateFormat.MEDIUM:
        return '55 × 50 cm'
      case PlateFormat.A3:
        return 'A3'
      default:
        return format
    }
  }

  const getFormatColor = (format: PlateFormat): string => {
    switch (format) {
      case PlateFormat.LARGE:
        return 'bg-blue-100 text-blue-800'
      case PlateFormat.MEDIUM:
        return 'bg-green-100 text-green-800'
      case PlateFormat.A3:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!state.project || state.project.plates.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Eye className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Aucune planche</p>
        <p className="text-xs text-gray-400 mt-1">
          Créez votre première planche
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {state.project.plates.map((plate, index) => {
        const stats = getPlateStats(plate.id)
        const isActive = state.currentPlateId === plate.id

        return (
          <div
            key={plate.id}
            className={`p-4 cursor-pointer transition-colors ${
              isActive 
                ? 'bg-dtf-50 border-l-4 border-dtf-500' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSelectPlate(plate.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Nom et format */}
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    Planche {index + 1}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getFormatColor(plate.format)}`}>
                    {getFormatLabel(plate.format)}
                  </span>
                </div>

                {/* Statistiques */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Éléments:</span>
                    <span>{plate.elements.length + plate.textElements.length}</span>
                  </div>
                  {stats && (
                    <div className="flex justify-between">
                      <span>Utilisation:</span>
                      <span>{stats.efficiency}%</span>
                    </div>
                  )}
                </div>

                {/* Barre de progression */}
                {stats && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-dtf-500 h-1 rounded-full transition-all"
                        style={{ width: `${Math.min(stats.efficiency, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 ml-2">
                {isActive && (
                  <div className="w-2 h-2 bg-dtf-500 rounded-full" title="Planche active" />
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearPlate(plate.id)
                  }}
                  className="p-1 rounded text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Vider la planche"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}