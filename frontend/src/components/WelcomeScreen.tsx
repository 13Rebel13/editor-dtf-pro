import React from 'react'
import { FileImage, Palette, Download, Zap } from 'lucide-react'

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dtf-50 to-primary-50 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo et titre */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-dtf-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Palette className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Éditeur de Planches DTF
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez et organisez vos fichiers d'impression DTF avec un éditeur professionnel.
            Disposition intuitive, export PDF vectoriel haute qualité.
          </p>
        </div>

        {/* Fonctionnalités principales */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-dtf-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-6 h-6 text-dtf-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multi-formats
            </h3>
            <p className="text-gray-600">
              Importez PNG, SVG, PDF, EPS, PSD, AI et plus encore. 
              Préservation de la qualité vectorielle.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-dtf-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-dtf-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Optimisation Auto
            </h3>
            <p className="text-gray-600">
              Algorithme de placement automatique pour maximiser 
              l'utilisation de vos planches.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-dtf-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-dtf-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Export Vectoriel
            </h3>
            <p className="text-gray-600">
              Génération PDF haute qualité avec préservation 
              des formats vectoriels originaux.
            </p>
          </div>
        </div>

        {/* Formats de planches */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Formats de planches supportés
          </h3>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-16 h-24 bg-dtf-100 rounded border-2 border-dtf-300 mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-700">55 × 100 cm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-dtf-100 rounded border-2 border-dtf-300 mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-700">55 × 50 cm</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-16 bg-dtf-100 rounded border-2 border-dtf-300 mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-700">A3</p>
            </div>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dtf-500"></div>
          <span className="ml-3 text-gray-600">Initialisation de l'éditeur...</span>
        </div>
      </div>
    </div>
  )
}