import React from 'react'
import { Header } from './layout/Header'
import { Toolbar } from './layout/Toolbar'
import { Canvas } from './canvas/Canvas'
import { PropertiesPanel } from './layout/PropertiesPanel'
import { useStore } from '../store/useStore'

export function Editor() {
  const { currentProject } = useStore()

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full bg-dtf-muted">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dtf-secondary-700 mb-4">
            Aucun projet ouvert
          </h2>
          <p className="text-dtf-secondary-500 mb-6">
            Utilisez le workflow guidé ou créez un nouveau projet pour commencer.
          </p>
          <button
            onClick={() => useStore.getState().toggleWorkflow()}
            className="dtf-btn-primary"
          >
            Ouvrir le workflow guidé
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <Toolbar />
        
        {/* Canvas area */}
        <div className="dtf-canvas-container">
          <Canvas />
        </div>
        
        {/* Properties panel */}
        <PropertiesPanel />
      </div>
    </div>
  )
}