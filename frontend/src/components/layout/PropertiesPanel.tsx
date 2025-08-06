import React from 'react'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Copy,
  Trash2,
  Move,
  RotateCw,
  Maximize,
  Type,
  Image,
  Square
} from 'lucide-react'
import { useStore } from '../../store/useStore'

export function PropertiesPanel() {
  const { canvas, currentProject } = useStore()
  const selectedElements = canvas.selectedElements

  // Get selected elements data
  const selectedElementsData = React.useMemo(() => {
    if (!currentProject || selectedElements.length === 0) return []
    
    return currentProject.layers.flatMap(layer => 
      layer.elements.filter(element => 
        selectedElements.includes(element.id)
      )
    )
  }, [currentProject, selectedElements])

  const hasSelection = selectedElementsData.length > 0
  const isMultipleSelection = selectedElementsData.length > 1

  return (
    <div className="dtf-properties">
      {/* Header */}
      <div className="dtf-panel-header">
        <h2 className="text-sm font-medium text-dtf-foreground">
          Propriétés
        </h2>
        <Settings className="w-4 h-4 text-dtf-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto dtf-scrollbar">
        {!hasSelection ? (
          <NoSelectionPanel />
        ) : isMultipleSelection ? (
          <MultipleSelectionPanel elements={selectedElementsData} />
        ) : (
          <SingleElementPanel element={selectedElementsData[0]!} />
        )}
      </div>
    </div>
  )
}

function NoSelectionPanel() {
  const { currentProject } = useStore()

  return (
    <div className="dtf-panel-content">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-dtf-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Move className="w-8 h-8 text-dtf-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-dtf-foreground mb-2">
          Aucune sélection
        </h3>
        <p className="text-xs text-dtf-muted-foreground">
          Sélectionnez un élément pour voir ses propriétés
        </p>
      </div>

      {/* Project info */}
      {currentProject && (
        <div className="dtf-panel-section">
          <div className="dtf-panel-header">
            <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
              Projet
            </h3>
          </div>
          <div className="dtf-panel-content">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-dtf-muted-foreground">Nom</label>
                <div className="dtf-input text-sm">{currentProject.name}</div>
              </div>
              <div>
                <label className="text-xs text-dtf-muted-foreground">Format</label>
                <div className="dtf-input text-sm">
                  {currentProject.format.name} ({currentProject.format.widthCm}×{currentProject.format.heightCm}cm)
                </div>
              </div>
              <div>
                <label className="text-xs text-dtf-muted-foreground">Résolution</label>
                <div className="dtf-input text-sm">300 DPI</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MultipleSelectionPanel({ elements }: { elements: any[] }) {
  return (
    <div className="dtf-panel-content">
      <div className="text-center py-4">
        <h3 className="text-sm font-medium text-dtf-foreground mb-2">
          {elements.length} éléments sélectionnés
        </h3>
      </div>

      {/* Common actions */}
      <div className="dtf-panel-section">
        <div className="dtf-panel-header">
          <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
            Actions
          </h3>
        </div>
        <div className="dtf-panel-content">
          <div className="grid grid-cols-2 gap-2">
            <button className="dtf-btn-secondary text-xs py-2">
              <Copy className="w-3 h-3 mr-1" />
              Dupliquer
            </button>
            <button className="dtf-btn-secondary text-xs py-2 text-dtf-error-600">
              <Trash2 className="w-3 h-3 mr-1" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Alignment tools */}
      <div className="dtf-panel-section">
        <div className="dtf-panel-header">
          <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
            Alignement
          </h3>
        </div>
        <div className="dtf-panel-content">
          <div className="grid grid-cols-3 gap-1">
            {['left', 'center', 'right', 'top', 'middle', 'bottom'].map((align) => (
              <button
                key={align}
                className="p-2 border border-dtf-border rounded hover:bg-dtf-muted text-xs"
                title={`Aligner ${align}`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SingleElementPanel({ element }: { element: any }) {
  const { updateElement } = useStore()

  const handleUpdateElement = (updates: Partial<any>) => {
    updateElement(element.id, updates)
  }

  return (
    <div className="dtf-panel-content">
      {/* Element type header */}
      <div className="flex items-center justify-between py-3 border-b border-dtf-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-dtf-primary-100 rounded flex items-center justify-center">
            {element.type === 'text' && <Type className="w-3 h-3 text-dtf-primary-600" />}
            {element.type === 'image' && <Image className="w-3 h-3 text-dtf-primary-600" />}
            {element.type === 'shape' && <Square className="w-3 h-3 text-dtf-primary-600" />}
          </div>
          <span className="text-sm font-medium capitalize">{element.type}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleUpdateElement({ visible: !element.visible })}
            className="p-1 hover:bg-dtf-muted rounded"
            title={element.visible ? 'Masquer' : 'Afficher'}
          >
            {element.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleUpdateElement({ locked: !element.locked })}
            className="p-1 hover:bg-dtf-muted rounded"
            title={element.locked ? 'Déverrouiller' : 'Verrouiller'}
          >
            {element.locked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Transform properties */}
      <div className="dtf-panel-section">
        <div className="dtf-panel-header">
          <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
            Position et taille
          </h3>
        </div>
        <div className="dtf-panel-content">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-dtf-muted-foreground">X</label>
              <input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => handleUpdateElement({ x: parseFloat(e.target.value) || 0 })}
                className="dtf-input text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-dtf-muted-foreground">Y</label>
              <input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => handleUpdateElement({ y: parseFloat(e.target.value) || 0 })}
                className="dtf-input text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-dtf-muted-foreground">Largeur</label>
              <input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => handleUpdateElement({ width: parseFloat(e.target.value) || 0 })}
                className="dtf-input text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-dtf-muted-foreground">Hauteur</label>
              <input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => handleUpdateElement({ height: parseFloat(e.target.value) || 0 })}
                className="dtf-input text-sm mt-1"
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label className="text-xs text-dtf-muted-foreground">Rotation</label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="range"
                min="0"
                max="360"
                value={element.rotation}
                onChange={(e) => handleUpdateElement({ rotation: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                value={Math.round(element.rotation)}
                onChange={(e) => handleUpdateElement({ rotation: parseFloat(e.target.value) || 0 })}
                className="dtf-input text-sm w-16"
              />
              <span className="text-xs text-dtf-muted-foreground">°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance properties */}
      <div className="dtf-panel-section">
        <div className="dtf-panel-header">
          <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
            Apparence
          </h3>
        </div>
        <div className="dtf-panel-content">
          <div>
            <label className="text-xs text-dtf-muted-foreground">Opacité</label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={element.opacity}
                onChange={(e) => handleUpdateElement({ opacity: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <span className="text-xs text-dtf-muted-foreground w-10">
                {Math.round(element.opacity * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Element-specific properties */}
      {element.type === 'text' && <TextProperties element={element} onUpdate={handleUpdateElement} />}
      {element.type === 'image' && <ImageProperties element={element} onUpdate={handleUpdateElement} />}
      {element.type === 'shape' && <ShapeProperties element={element} onUpdate={handleUpdateElement} />}

      {/* Actions */}
      <div className="dtf-panel-section">
        <div className="dtf-panel-content">
          <div className="grid grid-cols-2 gap-2">
            <button className="dtf-btn-secondary text-xs py-2">
              <Copy className="w-3 h-3 mr-1" />
              Dupliquer
            </button>
            <button className="dtf-btn-secondary text-xs py-2 text-dtf-error-600">
              <Trash2 className="w-3 h-3 mr-1" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TextProperties({ element, onUpdate }: { element: any; onUpdate: (updates: any) => void }) {
  return (
    <div className="dtf-panel-section">
      <div className="dtf-panel-header">
        <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
          Texte
        </h3>
      </div>
      <div className="dtf-panel-content">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-dtf-muted-foreground">Contenu</label>
            <textarea
              value={element.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="dtf-input text-sm mt-1 h-20 resize-none"
              placeholder="Tapez votre texte..."
            />
          </div>
          <div>
            <label className="text-xs text-dtf-muted-foreground">Police</label>
            <select
              value={element.fontFamily || 'Inter'}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="dtf-input text-sm mt-1"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dtf-muted-foreground">Taille</label>
            <input
              type="number"
              value={element.fontSize || 16}
              onChange={(e) => onUpdate({ fontSize: parseFloat(e.target.value) || 16 })}
              className="dtf-input text-sm mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageProperties({ element, onUpdate }: { element: any; onUpdate: (updates: any) => void }) {
  return (
    <div className="dtf-panel-section">
      <div className="dtf-panel-header">
        <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
          Image
        </h3>
      </div>
      <div className="dtf-panel-content">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-dtf-muted-foreground">Source</label>
            <div className="dtf-input text-sm mt-1 truncate">
              {element.src || 'Aucune image'}
            </div>
          </div>
          <div>
            <label className="text-xs text-dtf-muted-foreground">Ratio d'aspect</label>
            <div className="dtf-input text-sm mt-1">
              {element.aspectRatio ? element.aspectRatio.toFixed(2) : 'Auto'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShapeProperties({ element, onUpdate }: { element: any; onUpdate: (updates: any) => void }) {
  return (
    <div className="dtf-panel-section">
      <div className="dtf-panel-header">
        <h3 className="text-xs font-medium text-dtf-foreground uppercase tracking-wide">
          Forme
        </h3>
      </div>
      <div className="dtf-panel-content">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-dtf-muted-foreground">Type</label>
            <select
              value={element.shapeType || 'rectangle'}
              onChange={(e) => onUpdate({ shapeType: e.target.value })}
              className="dtf-input text-sm mt-1"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Cercle</option>
              <option value="ellipse">Ellipse</option>
              <option value="polygon">Polygone</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dtf-muted-foreground">Couleur de remplissage</label>
            <input
              type="color"
              value={element.fill || '#000000'}
              onChange={(e) => onUpdate({ fill: e.target.value })}
              className="dtf-input text-sm mt-1 h-8"
            />
          </div>
        </div>
      </div>
    </div>
  )
}