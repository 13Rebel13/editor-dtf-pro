import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { FileType, MIME_TYPES } from '@dtf-editor/shared'
import toast from 'react-hot-toast'

export function FileUpload() {
  const { dispatch } = useApp()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      // Valider le type de fichier
      const fileExtension = file.name.split('.').pop()?.toLowerCase() as FileType
      if (!Object.values(FileType).includes(fileExtension)) {
        toast.error(`Format non supporté: ${file.name}`)
        return
      }

      // Valider la taille (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`Fichier trop volumineux: ${file.name}`)
        return
      }

      // TODO: Implémenter l'upload vers Cloudflare R2
      console.log('Upload fichier:', file.name)
      toast.success(`Fichier ajouté: ${file.name}`)
    })
  }, [dispatch])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf'],
      'application/postscript': ['.eps'],
      'image/vnd.adobe.photoshop': ['.psd'],
      'application/illustrator': ['.ai']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  })

  const getDropzoneClass = () => {
    let baseClass = 'file-dropzone'
    
    if (isDragActive) {
      baseClass += ' active'
    }
    
    if (isDragReject) {
      baseClass += ' !border-red-500 !bg-red-50'
    }
    
    if (isDragAccept) {
      baseClass += ' !border-green-500 !bg-green-50'
    }
    
    return baseClass
  }

  return (
    <div {...getRootProps()} className={getDropzoneClass()}>
      <input {...getInputProps()} />
      
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          {isDragActive ? (
            <Upload className="w-6 h-6 text-dtf-500" />
          ) : (
            <FileImage className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        {isDragActive ? (
          <div className="text-sm">
            <p className="font-medium text-dtf-600 mb-1">
              Déposez vos fichiers ici
            </p>
            <p className="text-gray-500 text-xs">
              PNG, SVG, PDF, EPS, PSD, AI...
            </p>
          </div>
        ) : (
          <div className="text-sm">
            <p className="font-medium text-gray-900 mb-1">
              Glissez vos fichiers ici
            </p>
            <p className="text-gray-500 text-xs mb-2">
              ou cliquez pour parcourir
            </p>
            <p className="text-gray-400 text-xs">
              PNG, SVG, PDF, EPS, PSD, AI • Max 100MB
            </p>
          </div>
        )}
      </div>
    </div>
  )
}