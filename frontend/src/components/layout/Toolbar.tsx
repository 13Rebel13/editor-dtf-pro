import React from 'react'
import { 
  MousePointer, 
  Type, 
  Square, 
  Circle, 
  Image, 
  Hand, 
  ZoomIn,
  Upload,
  Layers,
  Palette,
  Scan
} from 'lucide-react'
import { useStore } from '../../store/useStore'

type Tool = 'select' | 'text' | 'shape' | 'image' | 'pan' | 'zoom'

interface ToolButtonProps {
  tool: Tool
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function ToolButton({ tool, icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 flex flex-col items-center justify-center space-y-1 
        text-xs transition-colors relative
        ${isActive 
          ? 'bg-dtf-primary-500 text-white' 
          : 'text-dtf-secondary-300 hover:text-dtf-secondary-100 hover:bg-dtf-secondary-800'
        }
      `}
      title={label}
    >
      <div className="w-5 h-5">
        {icon}
      </div>
      <span className="text-[10px] leading-tight">{label}</span>
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
      )}
    </button>
  )
}

export function Toolbar() {
  const { canvas, setTool } = useStore()
  const currentTool = canvas.tool

  const tools: Array<{ tool: Tool; icon: React.ReactNode; label: string }> = [
    { tool: 'select', icon: <MousePointer />, label: 'Sélection' },
    { tool: 'text', icon: <Type />, label: 'Texte' },
    { tool: 'shape', icon: <Square />, label: 'Formes' },
    { tool: 'image', icon: <Image />, label: 'Images' },
    { tool: 'pan', icon: <Hand />, label: 'Déplacer' },
    { tool: 'zoom', icon: <ZoomIn />, label: 'Zoom' },
  ]

  return (
    <div className="dtf-toolbar">
      {/* Tools section */}
      <div className="flex-1">
        <div className="p-2 border-b border-dtf-secondary-700">
          <h3 className="text-xs font-medium text-dtf-secondary-300 uppercase tracking-wide mb-2">
            Outils
          </h3>
        </div>
        
        <div className="space-y-1 p-1">
          {tools.map(({ tool, icon, label }) => (
            <ToolButton
              key={tool}
              tool={tool}
              icon={icon}
              label={label}
              isActive={currentTool === tool}
              onClick={() => setTool(tool)}
            />
          ))}
        </div>
      </div>

      {/* Quick actions section */}
      <div className="border-t border-dtf-secondary-700">
        <div className="p-2">
          <h3 className="text-xs font-medium text-dtf-secondary-300 uppercase tracking-wide mb-2">
            Actions
          </h3>
        </div>
        
        <div className="space-y-1 p-1">
          <button
            className="w-full p-3 flex flex-col items-center justify-center space-y-1 text-xs text-dtf-secondary-300 hover:text-dtf-secondary-100 hover:bg-dtf-secondary-800 transition-colors"
            title="Importer des fichiers"
          >
            <Upload className="w-5 h-5" />
            <span className="text-[10px] leading-tight">Import</span>
          </button>

          <button
            className="w-full p-3 flex flex-col items-center justify-center space-y-1 text-xs text-dtf-secondary-300 hover:text-dtf-secondary-100 hover:bg-dtf-secondary-800 transition-colors"
            title="Calques"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] leading-tight">Calques</span>
          </button>

          <button
            className="w-full p-3 flex flex-col items-center justify-center space-y-1 text-xs text-dtf-secondary-300 hover:text-dtf-secondary-100 hover:bg-dtf-secondary-800 transition-colors"
            title="Arrière-plans"
          >
            <Palette className="w-5 h-5" />
            <span className="text-[10px] leading-tight">Fonds</span>
          </button>

          <button
            className="w-full p-3 flex flex-col items-center justify-center space-y-1 text-xs text-dtf-secondary-300 hover:text-dtf-secondary-100 hover:bg-dtf-secondary-800 transition-colors"
            title="Analyse DTF"
          >
            <Scan className="w-5 h-5" />
            <span className="text-[10px] leading-tight">Analyse</span>
          </button>
        </div>
      </div>

      {/* Format info */}
      <div className="border-t border-dtf-secondary-700 p-3">
        <div className="text-xs text-dtf-secondary-400">
          <div className="font-medium mb-1">Format actuel</div>
          <div className="text-dtf-secondary-500">55×100cm</div>
          <div className="text-dtf-secondary-500">300 DPI</div>
        </div>
      </div>
    </div>
  )
}