import React, { useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import { Header } from './layout/Header'
import { Sidebar } from './layout/Sidebar'
import { CanvasArea } from './canvas/CanvasArea'
import { PropertiesPanel } from './panels/PropertiesPanel'
import { WelcomeScreen } from './WelcomeScreen'

export function MainEditor() {
  const { state, dispatch } = useApp()

  useEffect(() => {
    // Créer un projet par défaut au démarrage
    if (!state.project) {
      dispatch({
        type: 'CREATE_NEW_PROJECT',
        payload: { name: 'Nouveau Projet DTF' }
      })
    }
  }, [state.project, dispatch])

  if (!state.project) {
    return <WelcomeScreen />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* En-tête */}
      <Header />
      
      {/* Zone principale */}
      <div className="flex flex-1 overflow-hidden">
        {/* Barre latérale gauche - Fichiers et planches */}
        <Sidebar />
        
        {/* Zone de travail centrale */}
        <div className="flex-1 flex flex-col min-w-0">
          <CanvasArea />
        </div>
        
        {/* Panneau de propriétés à droite */}
        <PropertiesPanel />
      </div>
    </div>
  )
}