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
      cb(createApiError(`Extension de fichier non autorisée: .${extension}`, 400, 'INVALID_FILE_TYPE'))
      return
    }
    
    cb(null, true)
  }
})

/**
 * POST /api/files/upload-raw
 * Upload d'un ou plusieurs fichiers SANS transformation (qualité originale)
 */
router.post('/upload-raw', upload.array('files', 10) as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw createApiError('Aucun fichier fourni', 400, 'NO_FILES_PROVIDED')
    }

    const uploadedFiles: UploadedFile[] = []

    for (const file of req.files) {
      const fileId = uuidv4()
      const extension = file.originalname.split('.').pop()?.toLowerCase()
      
      if (!extension) {
        throw createApiError('Extension de fichier manquante', 400, 'MISSING_FILE_EXTENSION')
      }

      // Générer un nom de fichier unique dans le dossier dtf-uploads/
      const fileName = `dtf-uploads/${generateRandomFileName(extension as FileType)}`
      
      // Upload vers Cloudflare R2 SANS transformation
      const uploadUrl = await uploadToR2(file.buffer, fileName, file.mimetype)
      
      // Obtenir les métadonnées du fichier
      const metadata = await getFileMetadata(file.buffer, file.originalname)
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: fileName,
        originalName: file.originalname,
        fileName,
        url: uploadUrl,
        type: extension as FileType,
        size: file.size,
        dimensions: metadata.dimensions || { width: 0, height: 0 },
        dimensionsMm: metadata.dimensionsMm || { width: 0, height: 0 },
        uploadedAt: new Date()
      }
      
      uploadedFiles.push(uploadedFile)
      
      logger.info(`Fichier uploadé (raw): ${file.originalname} -> ${uploadUrl}`)
    }

    res.json({
      success: true,
      files: uploadedFiles
    })

  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/files/upload
 * Upload d'un ou plusieurs fichiers (avec optimisation)
 */
router.post('/upload', upload.array('files', 10) as any, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw createApiError('Aucun fichier fourni', 400, 'NO_FILES_PROVIDED')
    }

    const uploadedFiles: UploadedFile[] = []

    for (const file of req.files) {
      const fileId = uuidv4()
      const extension = file.originalname.split('.').pop()?.toLowerCase()
      
      if (!extension) {
        throw createApiError('Extension de fichier manquante', 400, 'MISSING_FILE_EXTENSION')
      }

      // Générer un nom de fichier unique
      const fileName = generateRandomFileName(extension as FileType)
      
      let processedBuffer = file.buffer
      let processedSize = file.size
      
      // Traitement spécial pour les images
      if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
        try {
          const image = sharp(file.buffer)
          const metadata = await image.metadata()
          
          // Optimisation de l'image
          processedBuffer = await image
            .resize(4000, 4000, { 
              fit: 'inside', 
              withoutEnlargement: true 
            })
            .jpeg({ 
              quality: 85, 
              progressive: true 
            })
            .toBuffer()
            
          processedSize = processedBuffer.length
          
          logger.info(`Image optimisée: ${file.originalname} (${metadata.width}x${metadata.height}) -> ${processedSize} bytes`)
        } catch (error) {
          logger.warn(`Échec de l'optimisation de l'image ${file.originalname}:`, error)
          // Continuer avec le fichier original en cas d'erreur
        }
      }

      // Upload vers Cloudflare R2
      const uploadUrl = await uploadToR2(processedBuffer, fileName, file.mimetype)
      
      // Obtenir les métadonnées du fichier
      const metadata = await getFileMetadata(file.buffer, file.originalname)
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: fileName,
        originalName: file.originalname,
        fileName,
        url: uploadUrl,
        type: extension as FileType,
        size: processedSize,
        dimensions: metadata.dimensions || { width: 0, height: 0 },
        dimensionsMm: metadata.dimensionsMm || { width: 0, height: 0 },
        uploadedAt: new Date()
      }
      
      uploadedFiles.push(uploadedFile)
      
      logger.info(`Fichier uploadé: ${file.originalname} -> ${fileName} (${processedSize} bytes)`)
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} fichier(s) uploadé(s) avec succès`,
      files: uploadedFiles
    })

  } catch (error) {
    logger.error('Erreur lors de l\'upload:', error)
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
      message: 'Fichier valide',
      metadata
    })

  } catch (error) {
    logger.error('Erreur lors de la validation:', error)
    next(error)
  }
})

export { router as filesRouter }