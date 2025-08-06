import React from 'react'
import { 
  Save, 
  Download, 
  Upload, 
  Undo2, 
  Redo2, 
  Settings, 
  Sun, 
  Moon,
  FileText,
  Workflow
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useTheme } from '../common/ThemeProvider'

export function Header() {
  const { 
    currentProject, 
    canvas, 
    undo, 
    redo, 
    toggleWorkflow,
    toggleGrid,
    toggleGuides,
    showGrid,
    showGuides
  } = useStore()
  
  const { theme, toggleTheme } = useTheme()

  const canUndo = canvas.history.past.length > 0
  const canRedo = canvas.history.future.length > 0

  return (
    <header className="h-16 bg-background border-b border-dtf-border flex items-center justify-between px-4">
      {/* Left section - Project info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-dtf-primary-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-dtf-foreground">
              {currentProject?.name || 'Graphite DTF Fusion'}
            </h1>
            {currentProject && (
              <p className="text-xs text-dtf-muted-foreground">
                {currentProject.format.name} • 300 DPI
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Center section - Main actions */}
      <div className="flex items-center space-x-2">
        {/* Undo/Redo */}
        <div className="flex items-center border border-dtf-border rounded-lg">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 hover:bg-dtf-muted disabled:opacity-50 disabled:cursor-not-allowed"
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-dtf-border" />
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 hover:bg-dtf-muted disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refaire (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* View controls */}
        <div className="flex items-center border border-dtf-border rounded-lg">
          <button
            onClick={toggleGrid}
            className={`p-2 hover:bg-dtf-muted ${showGrid ? 'bg-dtf-primary-100 text-dtf-primary-700' : ''}`}
            title="Afficher/masquer la grille"
          >
            <div className="w-4 h-4 border border-current grid grid-cols-2 grid-rows-2 gap-px">
              <div className="border border-current"></div>
              <div className="border border-current"></div>
              <div className="border border-current"></div>
              <div className="border border-current"></div>
            </div>
          </button>
          <div className="w-px h-6 bg-dtf-border" />
          <button
            onClick={toggleGuides}
            className={`p-2 hover:bg-dtf-muted ${showGuides ? 'bg-dtf-primary-100 text-dtf-primary-700' : ''}`}
            title="Afficher/masquer les guides"
          >
            <div className="w-4 h-4 relative">
              <div className="absolute top-1 left-0 w-full h-px bg-current"></div>
              <div className="absolute bottom-1 left-0 w-full h-px bg-current"></div>
              <div className="absolute left-1 top-0 w-px h-full bg-current"></div>
              <div className="absolute right-1 top-0 w-px h-full bg-current"></div>
            </div>
          </button>
        </div>

        {/* Export/Import */}
        <div className="flex items-center border border-dtf-border rounded-lg">
          <button
            className="p-2 hover:bg-dtf-muted"
            title="Importer"
          >
            <Upload className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-dtf-border" />
          <button
            className="p-2 hover:bg-dtf-muted"
            title="Exporter"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right section - Settings and theme */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleWorkflow}
          className="p-2 hover:bg-dtf-muted rounded-lg"
          title="Workflow guidé"
        >
          <Workflow className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-dtf-muted rounded-lg"
          title={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>

        <button
          className="p-2 hover:bg-dtf-muted rounded-lg"
          title="Paramètres"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          className="dtf-btn-primary"
          title="Sauvegarder le projet"
        >
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </button>
      </div>
    </header>
  )
}