import React from 'react'
import { Check } from 'lucide-react'
import type { DTFPlateFormat } from '../../../../shared/src/index.js'

// Temporary hardcoded formats for build
const DTF_PLATE_FORMATS: DTFPlateFormat[] = [
  {
    id: '55x100',
    name: '55×100cm',
    width: 6496,
    height: 11811,
    widthCm: 55,
    heightCm: 100,
    description: 'Format principal professionnel',
    isPrimary: true
  },
  {
    id: '55x50',
    name: '55×50cm',
    width: 6496,
    height: 5906,
    widthCm: 55,
    heightCm: 50,
    description: 'Format demi-plaque',
    isPrimary: false
  },
  {
    id: 'a3',
    name: 'A3',
    width: 3508,
    height: 4961,
    widthCm: 29.7,
    heightCm: 42,
    description: 'Format standard A3 pour tests',
    isPrimary: false
  }
]

interface PlateSelectorProps {
  selectedFormat: DTFPlateFormat | null
  onFormatSelect: (format: DTFPlateFormat) => void
}

export function PlateSelector({ selectedFormat, onFormatSelect }: PlateSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DTF_PLATE_FORMATS.map((format) => (
          <FormatCard
            key={format.id}
            format={format}
            isSelected={selectedFormat?.id === format.id}
            onSelect={onFormatSelect}
          />
        ))}
      </div>
      
      {selectedFormat && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-medium mb-2">Détails du format sélectionné</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Nom :</span>
              <span className="ml-2 font-medium">{selectedFormat.name}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Dimensions :</span>
              <span className="ml-2 font-medium">{selectedFormat.widthCm} × {selectedFormat.heightCm} cm</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Résolution :</span>
              <span className="ml-2 font-medium">{selectedFormat.width} × {selectedFormat.height} px</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Rapport :</span>
              <span className="ml-2 font-medium">{(selectedFormat.widthCm / selectedFormat.heightCm).toFixed(2)}</span>
            </div>
          </div>
          {selectedFormat.description && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {selectedFormat.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface FormatCardProps {
  format: DTFPlateFormat
  isSelected: boolean
  onSelect: (format: DTFPlateFormat) => void
}

function FormatCard({ format, isSelected, onSelect }: FormatCardProps) {
  return (
    <button
      onClick={() => onSelect(format)}
      className={`
        relative p-4 border-2 rounded-lg text-left transition-all duration-200
        ${isSelected 
          ? 'border-dtf-primary bg-dtf-primary/5 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 hover:border-dtf-primary/50 hover:shadow-sm'
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-dtf-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {format.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format.widthCm} × {format.heightCm} cm
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{format.width} × {format.height} px</span>
          <span>•</span>
          <span>{(format.widthCm / format.heightCm).toFixed(2)}</span>
        </div>
      </div>
    </button>
  )
}