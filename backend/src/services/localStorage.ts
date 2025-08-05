import fs from 'fs'
import path from 'path'
import { logger } from '../utils/logger'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

// Créer le répertoire uploads s'il n'existe pas
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  logger.info(`Répertoire uploads créé: ${UPLOADS_DIR}`)
}

/**
 * Upload un fichier vers le stockage local
 */
export async function uploadToLocal(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const filePath = path.join(UPLOADS_DIR, fileName)
    
    // Créer les sous-répertoires si nécessaire
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // Écrire le fichier
    fs.writeFileSync(filePath, buffer)
    
    // Retourner l'URL complète pour accéder au fichier
    const baseUrl = process.env.PUBLIC_URL || 'http://localhost:3001'
    const fileUrl = `${baseUrl}/uploads/${fileName}`
    
    logger.info(`Fichier sauvegardé localement: ${fileName}`)
    
    return fileUrl

  } catch (error) {
    logger.error('Erreur stockage local:', error)
    throw new Error('Erreur lors du stockage du fichier')
  }
}

/**
 * Supprime un fichier du stockage local
 */
export async function deleteFromLocal(fileName: string): Promise<void> {
  try {
    const filePath = path.join(UPLOADS_DIR, fileName)
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      logger.info(`Fichier supprimé: ${fileName}`)
    }

  } catch (error) {
    logger.error('Erreur suppression locale:', error)
    throw new Error('Erreur lors de la suppression du fichier')
  }
}