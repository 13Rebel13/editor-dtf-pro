import React from 'react'
import { FileImage, Trash2, Plus } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { formatFileSize } from '@dtf-editor/shared'

export function FileList() {
  const { state, dispatch } = useApp()

  const handleRemoveFile = (fileId: string) => {
    dispatch({
      type: 'REMOVE_UPLOADED_FILE',
      payload: fileId
    })
  }

  const handleAddToPlate = (fileId: string) => {
    // TODO: Ouvrir modal de configuration avant ajout
    console.log('Ajouter à la planche:', fileId)
  }

  if (state.uploadedFiles.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <FileImage className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Aucun fichier importé</p>
        <p className="text-xs text-gray-400 mt-1">
          Glissez vos fichiers dans la zone d'upload
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {state.uploadedFiles.map((file) => (
        <div key={file.id} className="p-4 hover:bg-gray-50 group">
          <div className="flex items-start space-x-3">
            {/* Aperçu/Icône */}
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {file.url ? (
                <img
                  src={file.url}
                  alt={file.originalName}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <FileImage className="w-5 h-5 text-gray-400" />
            </div>

            {/* Informations fichier */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.originalName}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  {Math.round(file.dimensionsMm.width)} × {Math.round(file.dimensionsMm.height)} mm
                </p>
                <p>
                  {formatFileSize(file.size)} • {file.fileType.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleAddToPlate(file.id)}
                className="p-1 rounded text-dtf-600 hover:bg-dtf-100"
                title="Ajouter à la planche"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRemoveFile(file.id)}
                className="p-1 rounded text-red-600 hover:bg-red-100"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}