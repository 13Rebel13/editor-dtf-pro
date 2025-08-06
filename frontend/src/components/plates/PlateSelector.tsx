import React from 'react'
import { Check, Ruler } from 'lucide-react'
import { DTF_PLATE_FORMATS, type DTFPlateFormat } from '../../../../shared/src/types/index.js'

interface PlateSelectorProps {
  selectedFormat: DTFPlateFormat | null
  onFormatSelect: (format: DTFPlateFormat) => void
}

export function PlateSelector({ selectedFormat, onFormatSelect }: PlateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Ruler className="w-12 h-12 text-dtf-primary-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dtf-foreground mb-2">
          Choisissez le format de planche
        </h3>
        <p className="text-dtf-muted-foreground">
          Sélectionnez le format qui correspond à votre imprimante DTF
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DTF_PLATE_FORMATS.map((format) => (
          <FormatCard
            key={format.id}
            format={format}
            isSelected={selectedFormat?.id === format.id}
            onSelect={() => onFormatSelect(format)}
          />
        ))}
      </div>

      {selectedFormat && (
        <div className="mt-6 p-4 bg-dtf-primary-50 border border-dtf-primary-200 rounded-lg">
          <h4 className="font-medium text-dtf-primary-900 mb-2">
            Format sélectionné : {selectedFormat.name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-dtf-primary-700">
            <div>
              <span className="font-medium">Dimensions physiques :</span>
              <br />
              {selectedFormat.widthCm} × {selectedFormat.heightCm} cm
            </div>
            <div>
              <span className="font-medium">Résolution à 300 DPI :</span>
              <br />
              {selectedFormat.width} × {selectedFormat.height} pixels
            </div>
          </div>
          <p className="text-sm text-dtf-primary-600 mt-2">
            {selectedFormat.description}
          </p>
        </div>
      )}
    </div>
  )
}

interface FormatCardProps {
  format: DTFPlateFormat
  isSelected: boolean
  onSelect: () => void
}

function FormatCard({ format, isSelected, onSelect }: FormatCardProps) {
  const aspectRatio = format.width / format.height
  const cardWidth = 200
  const cardHeight = cardWidth / aspectRatio

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-4 rounded-lg border-2 transition-all hover:shadow-medium
        ${isSelected 
          ? 'border-dtf-primary-500 bg-dtf-primary-50' 
          : 'border-dtf-border bg-background hover:border-dtf-primary-300'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-dtf-primary-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Format preview */}
      <div className="flex flex-col items-center space-y-3">
        <div 
          className={`
            bg-white border-2 border-dashed rounded
            ${isSelected ? 'border-dtf-primary-300' : 'border-dtf-border'}
          `}
          style={{
            width: Math.min(cardWidth, 160),
            height: Math.min(cardHeight, 120),
            maxHeight: 120
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-dtf-muted-foreground">
            <Ruler className="w-6 h-6" />
          </div>
        </div>

        <div className="text-center">
          <h3 className={`font-medium ${isSelected ? 'text-dtf-primary-900' : 'text-dtf-foreground'}`}>
            {format.name}
            {format.isPrimary && (
              <span className="ml-2 text-xs bg-dtf-primary-500 text-white px-2 py-1 rounded-full">
                Principal
              </span>
            )}
          </h3>
          <p className={`text-sm ${isSelected ? 'text-dtf-primary-700' : 'text-dtf-muted-foreground'}`}>
            {format.widthCm} × {format.heightCm} cm
          </p>
          <p className={`text-xs ${isSelected ? 'text-dtf-primary-600' : 'text-dtf-muted-foreground'}`}>
            {format.width} × {format.height} px
          </p>
        </div>
      </div>

      <div className={`mt-3 text-xs ${isSelected ? 'text-dtf-primary-600' : 'text-dtf-muted-foreground'}`}>
        {format.description}
      </div>
    </button>
  )
}