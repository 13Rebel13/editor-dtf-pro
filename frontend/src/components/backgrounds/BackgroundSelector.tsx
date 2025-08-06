import React, { useState } from 'react'
import { Palette, Droplets, Grid, Image, Paintbrush } from 'lucide-react'
import { ChromePicker } from 'react-color'
import type { Background } from '../../../../shared/src/types/index.js'

interface BackgroundSelectorProps {
  selectedBackground: Background | null
  onBackgroundSelect: (background: Background) => void
}

type BackgroundTab = 'solid' | 'gradient' | 'pattern' | 'texture' | 'image'

const tabs: Array<{ id: BackgroundTab; label: string; icon: React.ReactNode }> = [
  { id: 'solid', label: 'Couleur unie', icon: <Palette className="w-4 h-4" /> },
  { id: 'gradient', label: 'Dégradé', icon: <Droplets className="w-4 h-4" /> },
  { id: 'pattern', label: 'Motifs', icon: <Grid className="w-4 h-4" /> },
  { id: 'texture', label: 'Textures', icon: <Paintbrush className="w-4 h-4" /> },
  { id: 'image', label: 'Image', icon: <Image className="w-4 h-4" /> },
]

const defaultColors = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da',
  '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529',
  '#ff6b6b', '#ee5a52', '#ff8787', '#ffa8a8', '#ffc9c9',
  '#51cf66', '#40c057', '#69db7c', '#8ce99a', '#a9e34b',
  '#339af0', '#228be6', '#74c0fc', '#91a7ff', '#a5b4fc',
  '#845ef7', '#7048e8', '#9775fa', '#b197fc', '#d0bfff',
  '#ff8cc8', '#f06292', '#ffb3d9', '#ffc2e6', '#ffd1f2',
  '#ffd43b', '#fab005', '#ffe066', '#ffec99', '#fff3bf',
]

export function BackgroundSelector({ selectedBackground, onBackgroundSelect }: BackgroundSelectorProps) {
  const [activeTab, setActiveTab] = useState<BackgroundTab>('solid')
  const [customColor, setCustomColor] = useState('#ffffff')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleSolidColorSelect = (color: string) => {
    onBackgroundSelect({
      type: 'solid',
      color
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="w-12 h-12 text-dtf-primary-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dtf-foreground mb-2">
          Choisissez un arrière-plan
        </h3>
        <p className="text-dtf-muted-foreground">
          Personnalisez l'apparence de votre planche DTF
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors
              ${activeTab === tab.id
                ? 'bg-dtf-primary-500 text-white border-dtf-primary-500'
                : 'bg-background border-dtf-border text-dtf-foreground hover:bg-dtf-muted'
              }
            `}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[300px]">
        {activeTab === 'solid' && (
          <SolidColorTab
            customColor={customColor}
            showColorPicker={showColorPicker}
            onColorSelect={handleSolidColorSelect}
            onCustomColorChange={setCustomColor}
            onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
            selectedBackground={selectedBackground}
          />
        )}

        {activeTab === 'gradient' && (
          <GradientTab
            onBackgroundSelect={onBackgroundSelect}
            selectedBackground={selectedBackground}
          />
        )}

        {activeTab === 'pattern' && (
          <PatternTab
            onBackgroundSelect={onBackgroundSelect}
            selectedBackground={selectedBackground}
          />
        )}

        {activeTab === 'texture' && (
          <TextureTab
            onBackgroundSelect={onBackgroundSelect}
            selectedBackground={selectedBackground}
          />
        )}

        {activeTab === 'image' && (
          <ImageTab
            onBackgroundSelect={onBackgroundSelect}
            selectedBackground={selectedBackground}
          />
        )}
      </div>

      {/* Selected background preview */}
      {selectedBackground && (
        <div className="p-4 bg-dtf-muted border border-dtf-border rounded-lg">
          <h4 className="font-medium text-dtf-foreground mb-3">Aperçu sélectionné</h4>
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-lg border border-dtf-border shadow-sm"
              style={{
                background: selectedBackground.type === 'solid' 
                  ? selectedBackground.color 
                  : selectedBackground.type === 'gradient'
                  ? `linear-gradient(45deg, ${selectedBackground.colors[0]?.color || '#fff'}, ${selectedBackground.colors[selectedBackground.colors.length - 1]?.color || '#000'})`
                  : '#f0f0f0'
              }}
            />
            <div className="text-sm">
              <p className="font-medium text-dtf-foreground capitalize">
                {selectedBackground.type}
              </p>
              <p className="text-dtf-muted-foreground">
                {selectedBackground.type === 'solid' && selectedBackground.color}
                {selectedBackground.type === 'gradient' && `${selectedBackground.colors.length} couleurs`}
                {selectedBackground.type === 'pattern' && selectedBackground.patternType}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SolidColorTab({ 
  customColor, 
  showColorPicker, 
  onColorSelect, 
  onCustomColorChange, 
  onToggleColorPicker,
  selectedBackground
}: {
  customColor: string
  showColorPicker: boolean
  onColorSelect: (color: string) => void
  onCustomColorChange: (color: string) => void
  onToggleColorPicker: () => void
  selectedBackground: Background | null
}) {
  return (
    <div className="space-y-4">
      {/* Default colors */}
      <div>
        <h4 className="text-sm font-medium text-dtf-foreground mb-3">Couleurs prédéfinies</h4>
        <div className="grid grid-cols-10 gap-2">
          {defaultColors.map((color) => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={`
                w-8 h-8 rounded border-2 transition-transform hover:scale-110
                ${selectedBackground?.type === 'solid' && selectedBackground.color === color
                  ? 'border-dtf-primary-500 ring-2 ring-dtf-primary-200'
                  : 'border-dtf-border'
                }
              `}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom color picker */}
      <div>
        <h4 className="text-sm font-medium text-dtf-foreground mb-3">Couleur personnalisée</h4>
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleColorPicker}
            className="w-12 h-12 rounded-lg border border-dtf-border shadow-sm"
            style={{ backgroundColor: customColor }}
          />
          <div className="flex-1">
            <input
              type="text"
              value={customColor}
              onChange={(e) => onCustomColorChange(e.target.value)}
              className="dtf-input w-full"
              placeholder="#ffffff"
            />
          </div>
          <button
            onClick={() => onColorSelect(customColor)}
            className="dtf-btn-primary"
          >
            Utiliser
          </button>
        </div>

        {showColorPicker && (
          <div className="mt-4">
            <ChromePicker
              color={customColor}
              onChange={(color) => onCustomColorChange(color.hex)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function GradientTab({ onBackgroundSelect, selectedBackground }: {
  onBackgroundSelect: (background: Background) => void
  selectedBackground: Background | null
}) {
  const gradientPresets = [
    { colors: [{ color: '#667eea', stop: 0 }, { color: '#764ba2', stop: 1 }] },
    { colors: [{ color: '#f093fb', stop: 0 }, { color: '#f5576c', stop: 1 }] },
    { colors: [{ color: '#4facfe', stop: 0 }, { color: '#00f2fe', stop: 1 }] },
    { colors: [{ color: '#43e97b', stop: 0 }, { color: '#38f9d7', stop: 1 }] },
    { colors: [{ color: '#fa709a', stop: 0 }, { color: '#fee140', stop: 1 }] },
    { colors: [{ color: '#a8edea', stop: 0 }, { color: '#fed6e3', stop: 1 }] },
  ]

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-dtf-foreground">Dégradés prédéfinis</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gradientPresets.map((preset, index) => (
          <button
            key={index}
            onClick={() => onBackgroundSelect({
              type: 'gradient',
              gradientType: 'linear',
              colors: preset.colors,
              angle: 45
            })}
            className="h-20 rounded-lg border border-dtf-border hover:border-dtf-primary-300 transition-colors"
            style={{
              background: `linear-gradient(45deg, ${preset.colors[0]?.color}, ${preset.colors[1]?.color})`
            }}
          />
        ))}
      </div>
    </div>
  )
}

function PatternTab({ onBackgroundSelect, selectedBackground }: {
  onBackgroundSelect: (background: Background) => void
  selectedBackground: Background | null
}) {
  const patterns = [
    { type: 'dots', name: 'Points' },
    { type: 'stripes', name: 'Rayures' },
    { type: 'checkerboard', name: 'Damier' },
    { type: 'hexagon', name: 'Hexagones' },
    { type: 'triangles', name: 'Triangles' },
  ] as const

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-dtf-foreground">Motifs disponibles</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {patterns.map((pattern) => (
          <button
            key={pattern.type}
            onClick={() => onBackgroundSelect({
              type: 'pattern',
              patternType: pattern.type,
              primaryColor: '#000000',
              secondaryColor: '#ffffff',
              size: 20
            })}
            className="p-4 border border-dtf-border rounded-lg hover:border-dtf-primary-300 transition-colors"
          >
            <div className="w-full h-16 bg-dtf-muted rounded mb-2"></div>
            <p className="text-sm font-medium text-dtf-foreground">{pattern.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function TextureTab({ onBackgroundSelect, selectedBackground }: {
  onBackgroundSelect: (background: Background) => void
  selectedBackground: Background | null
}) {
  const textures = [
    { type: 'wood', name: 'Bois' },
    { type: 'metal', name: 'Métal' },
    { type: 'fabric', name: 'Tissu' },
    { type: 'paper', name: 'Papier' },
    { type: 'concrete', name: 'Béton' },
    { type: 'marble', name: 'Marbre' },
  ] as const

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-dtf-foreground">Textures disponibles</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {textures.map((texture) => (
          <button
            key={texture.type}
            onClick={() => onBackgroundSelect({
              type: 'texture',
              textureType: texture.type,
              url: `/textures/${texture.type}.jpg`,
              scale: 1,
              opacity: 1
            })}
            className="p-4 border border-dtf-border rounded-lg hover:border-dtf-primary-300 transition-colors"
          >
            <div className="w-full h-16 bg-dtf-muted rounded mb-2"></div>
            <p className="text-sm font-medium text-dtf-foreground">{texture.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function ImageTab({ onBackgroundSelect, selectedBackground }: {
  onBackgroundSelect: (background: Background) => void
  selectedBackground: Background | null
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-dtf-foreground">Image personnalisée</h4>
      <div className="border-2 border-dashed border-dtf-border rounded-lg p-8 text-center">
        <Image className="w-12 h-12 text-dtf-muted-foreground mx-auto mb-4" />
        <p className="text-dtf-muted-foreground mb-4">
          Glissez votre image ici ou cliquez pour parcourir
        </p>
        <button className="dtf-btn-primary">
          Choisir une image
        </button>
      </div>
    </div>
  )
}