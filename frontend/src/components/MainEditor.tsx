import React, { useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import { Header } from './layout/Header'
import { Sidebar } from './layout/Sidebar'
import { CanvasArea } from './canvas/CanvasArea'
import { PropertiesPanel } from './panels/PropertiesPanel'

export function MainEditor() {
  const { state, dispatch } = useApp()

  useEffect(() => {
    // Créer un projet par défaut au démarrage immédiatement
    if (!state.project) {
      dispatch({
        type: 'CREATE_NEW_PROJECT',
        payload: { name: 'Nouveau Projet DTF' }
      })
    }
  }, [state.project, dispatch])

  // Toujours afficher l'éditeur, plus d'écran d'accueil
  if (!state.project) {
    // Loading temporaire pendant la création du projet
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dtf-500"></div>
        <span className="ml-3 text-gray-600">Chargement de l'éditeur...</span>
      </div>
    )
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