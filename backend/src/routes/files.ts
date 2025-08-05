import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { FileType, UploadedFile, generateRandomFileName } from '@dtf-editor/shared'
import { createApiError } from '../middleware/errorHandler'
import { uploadToR2, deleteFromR2 } from '../services/cloudflareR2'
import { getFileMetadata } from '../utils/fileUtils'
import { logger } from '../utils/logger'

const router = Router()

// Configuration multer pour l'upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB
    files: 10 // Max 10 fichiers par requête
  },
  fileFilter: (req, file, cb) => {
    // Vérifier l'extension
    const extension = file.originalname.split('.').pop()?.toLowerCase()
    const allowedExtensions = Object.values(FileType)
    
    if (!extension || !allowedExtensions.includes(extension as FileType)) {
      cb(createApiError(
        `Format de fichier non supporté: ${extension}`,
        400,
        'UNSUPPORTED_FILE_FORMAT'
      ))
      return
    }
    
    cb(null, true)
  }
})

/**
 * POST /api/files/upload
 * Upload d'un ou plusieurs fichiers
 */
router.post('/upload', upload.array('files', 10) as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw createApiError('Aucun fichier fourni', 400, 'NO_FILES_PROVIDED')
    }

    const uploadedFiles: UploadedFile[] = []

    for (const file of req.files) {
      try {
        // Générer un nom unique
        const fileName = generateRandomFileName(file.originalname)
        const fileId = uuidv4()
        
        // Obtenir les métadonnées du fichier
        const metadata = await getFileMetadata(file.buffer, file.originalname)
        
        // Upload vers Cloudflare R2
        const r2Url = await uploadToR2(file.buffer, fileName, file.mimetype)
        
        // Créer l'objet UploadedFile
        const uploadedFile: UploadedFile = {
          id: fileId,
          originalName: file.originalname,
          fileName,
          url: r2Url,
          fileType: metadata.fileType,
          size: file.size,
          dimensions: metadata.dimensions,
          dimensionsMm: metadata.dimensionsMm,
          uploadedAt: new Date()
        }
        
        uploadedFiles.push(uploadedFile)
        
        logger.info(`Fichier uploadé: ${file.originalname} -> ${fileName}`)
        
      } catch (error) {
        logger.error(`Erreur upload fichier ${file.originalname}:`, error)
        // Continue avec les autres fichiers
      }
    }

    if (uploadedFiles.length === 0) {
      throw createApiError('Aucun fichier n\'a pu être uploadé', 400, 'UPLOAD_FAILED')
    }

    res.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} fichier(s) uploadé(s) avec succès`
    })

  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/files/:fileId
 * Suppression d'un fichier
 */
router.delete('/:fileId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileId } = req.params
    
    if (!fileId) {
      throw createApiError('ID de fichier requis', 400, 'FILE_ID_REQUIRED')
    }

    // TODO: Récupérer les informations du fichier depuis une base de données
    // Pour l'instant, on suppose que le nom du fichier est fourni
    const { fileName } = req.body
    
    if (!fileName) {
      throw createApiError('Nom de fichier requis', 400, 'FILE_NAME_REQUIRED')
    }

    // Supprimer de Cloudflare R2
    await deleteFromR2(fileName)
    
    logger.info(`Fichier supprimé: ${fileName}`)

    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    })

  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/files/:fileId/metadata
 * Récupération des métadonnées d'un fichier
 */
router.get('/:fileId/metadata', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileId } = req.params
    
    if (!fileId) {
      throw createApiError('ID de fichier requis', 400, 'FILE_ID_REQUIRED')
    }

    // TODO: Implémenter la récupération depuis une base de données
    
    res.json({
      success: true,
      message: 'Fonctionnalité en cours de développement'
    })

  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/files/validate
 * Validation d'un fichier avant upload
 */
router.post('/validate', upload.single('file') as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw createApiError('Aucun fichier fourni', 400, 'NO_FILE_PROVIDED')
    }

    const metadata = await getFileMetadata(req.file.buffer, req.file.originalname)
    
    res.json({
      success: true,
      valid: true,
      metadata: {
        fileType: metadata.fileType,
        size: req.file.size,
        dimensions: metadata.dimensions,
        dimensionsMm: metadata.dimensionsMm
      }
    })

  } catch (error) {
    next(error)
  }
})

export { router as filesRouter }