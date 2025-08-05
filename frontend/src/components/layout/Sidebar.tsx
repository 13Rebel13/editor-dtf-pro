import React, { useState } from 'react'
import { Files, Layers, Upload, Plus } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { FileUpload } from '../upload/FileUpload'
import { FileList } from '../files/FileList'
import { PlateList } from '../plates/PlateList'

type SidebarTab = 'files' | 'plates'

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('files')
  const { state } = useApp()

  return (
    <div className="sidebar">
      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'files'
                ? 'border-dtf-500 text-dtf-600 bg-dtf-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Files className="w-4 h-4 inline mr-2" />
            Fichiers
            {state.uploadedFiles.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {state.uploadedFiles.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('plates')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'plates'
                ? 'border-dtf-500 text-dtf-600 bg-dtf-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Planches
            {state.project && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {state.project.plates.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'files' && (
          <div className="h-full flex flex-col">
            {/* Zone d'upload */}
            <div className="p-4 border-b border-gray-200">
              <FileUpload />
            </div>

            {/* Liste des fichiers */}
            <div className="flex-1 overflow-y-auto">
              <FileList />
            </div>

            {/* Actions fichiers */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="btn-outline w-full !justify-center">
                <Upload className="w-4 h-4 mr-2" />
                Importer des fichiers
              </button>
            </div>
          </div>
        )}

        {activeTab === 'plates' && (
          <div className="h-full flex flex-col">
            {/* Liste des planches */}
            <div className="flex-1 overflow-y-auto">
              <PlateList />
            </div>

            {/* Actions planches */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="btn-outline w-full !justify-center">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle planche
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}