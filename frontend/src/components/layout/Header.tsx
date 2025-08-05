import React from 'react'
import { 
  Save, 
  Download, 
  Undo, 
  Redo, 
  Palette, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Settings
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export function Header() {
  const { state, dispatch } = useApp()

  const handleSave = () => {
    // TODO: Implémenter la sauvegarde
    console.log('Sauvegarder le projet')
  }

  const handleExport = () => {
    // TODO: Implémenter l'export PDF
    console.log('Exporter en PDF')
  }

  const handleUndo = () => {
    // TODO: Implémenter l'annulation
    console.log('Annuler')
  }

  const handleRedo = () => {
    // TODO: Implémenter la répétition
    console.log('Répéter')
  }

  return (
    <header className="toolbar">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-dtf-500 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">DTF Editor</span>
        </div>

        {/* Nom du projet */}
        <div className="text-sm text-gray-600">
          {state.project?.name || 'Projet sans nom'}
        </div>
      </div>

      {/* Actions principales */}
      <div className="flex items-center space-x-2">
        {/* Historique */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={handleUndo}
            className="btn-outline !px-2 !py-2"
            title="Annuler (Ctrl+Z)"
            disabled
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            className="btn-outline !px-2 !py-2 ml-1"
            title="Répéter (Ctrl+Y)"
            disabled
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            className="btn-outline !px-2 !py-2"
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 mx-2 min-w-[3rem] text-center">
            100%
          </span>
          <button
            className="btn-outline !px-2 !py-2"
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            className="btn-outline !px-2 !py-2 ml-1"
            title="Ajuster à la fenêtre"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <button
          onClick={handleSave}
          className="btn-secondary"
          title="Sauvegarder (Ctrl+S)"
        >
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </button>

        <button
          onClick={handleExport}
          className="btn-primary"
          title="Exporter en PDF"
          disabled={state.loading}
        >
          <Download className="w-4 h-4 mr-2" />
          {state.loading ? 'Export...' : 'Exporter PDF'}
        </button>

        {/* Paramètres */}
        <button
          className="btn-outline !px-2 !py-2"
          title="Paramètres"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}