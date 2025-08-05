import React from 'react'
import { FileImage, Palette, Download, Zap } from 'lucide-react'

export function WelcomeScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md mx-auto text-center">
        {/* Logo compact */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-dtf-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Éditeur DTF
          </h1>
          <p className="text-sm text-gray-600">
            Éditeur de planches d'impression DTF
          </p>
        </div>

        {/* Loading */}
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dtf-500"></div>
          <span className="ml-2 text-sm text-gray-600">Chargement...</span>
        </div>
      </div>
    </div>
  )
}