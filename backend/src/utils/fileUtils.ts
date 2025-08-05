import sharp from 'sharp'
import { FileType, Dimensions, CONSTANTS } from '@dtf-editor/shared'
import { createApiError } from '../middleware/errorHandler'

interface FileMetadata {
  fileType: FileType
  dimensions: Dimensions
  dimensionsMm: Dimensions
}

/**
 * Extrait les métadonnées d'un fichier à partir de son buffer
 */
export async function getFileMetadata(buffer: Buffer, originalName: string): Promise<FileMetadata> {
  const extension = originalName.split('.').pop()?.toLowerCase() as FileType
  
  if (!extension || !Object.values(FileType).includes(extension)) {
    throw createApiError(
      `Extension de fichier non supportée: ${extension}`,
      400,
      'UNSUPPORTED_FILE_TYPE'
    )
  }

  let dimensions: Dimensions

  try {
    switch (extension) {
      case FileType.PNG:
      case FileType.JPG:
      case FileType.JPEG:
      case FileType.WEBP:
        dimensions = await getImageDimensions(buffer)
        break
        
      case FileType.SVG:
        dimensions = await getSvgDimensions(buffer)
        break
        
      case FileType.PDF:
        dimensions = await getPdfDimensions(buffer)
        break
        
      case FileType.EPS:
        dimensions = await getEpsDimensions(buffer)
        break
        
      case FileType.PSD:
        dimensions = await getPsdDimensions(buffer)
        break
        
      case FileType.AI:
        dimensions = await getAiDimensions(buffer)
        break
        
      default:
        throw createApiError(
          `Type de fichier non géré: ${extension}`,
          400,
          'UNSUPPORTED_FILE_TYPE'
        )
    }

    // Convertir en millimètres (96 DPI par défaut)
    const dimensionsMm: Dimensions = {
      width: Math.round(dimensions.width * CONSTANTS.PX_TO_MM),
      height: Math.round(dimensions.height * CONSTANTS.PX_TO_MM)
    }

    return {
      fileType: extension,
      dimensions,
      dimensionsMm
    }

  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    
    throw createApiError(
      `Erreur lors de l'analyse du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      400,
      'FILE_ANALYSIS_ERROR'
    )
  }
}

/**
 * Obtient les dimensions d'une image raster
 */
async function getImageDimensions(buffer: Buffer): Promise<Dimensions> {
  const metadata = await sharp(buffer).metadata()
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Impossible de lire les dimensions de l\'image')
  }

  return {
    width: metadata.width,
    height: metadata.height
  }
}

/**
 * Obtient les dimensions d'un fichier SVG
 */
async function getSvgDimensions(buffer: Buffer): Promise<Dimensions> {
  const svgContent = buffer.toString('utf-8')
  
  // Rechercher les attributs width et height
  const widthMatch = svgContent.match(/width=["|']([^"|']+)["|']/i)
  const heightMatch = svgContent.match(/height=["|']([^"|']+)["|']/i)
  
  if (widthMatch && heightMatch) {
    const width = parseFloat(widthMatch[1])
    const height = parseFloat(heightMatch[1])
    
    if (!isNaN(width) && !isNaN(height)) {
      return { width, height }
    }
  }
  
  // Rechercher la viewBox en fallback
  const viewBoxMatch = svgContent.match(/viewBox=["|']([^"|']+)["|']/i)
  if (viewBoxMatch) {
    const values = viewBoxMatch[1].split(/\s+/)
    if (values.length >= 4) {
      const width = parseFloat(values[2])
      const height = parseFloat(values[3])
      
      if (!isNaN(width) && !isNaN(height)) {
        return { width, height }
      }
    }
  }
  
  // Valeurs par défaut si aucune dimension trouvée
  return { width: 300, height: 150 }
}

/**
 * Obtient les dimensions d'un fichier PDF
 */
async function getPdfDimensions(buffer: Buffer): Promise<Dimensions> {
  // Analyse simplifiée du PDF - recherche de la MediaBox
  const pdfContent = buffer.toString('latin1')
  
  const mediaBoxMatch = pdfContent.match(/\/MediaBox\s*\[\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*\]/i)
  
  if (mediaBoxMatch) {
    const x1 = parseFloat(mediaBoxMatch[1])
    const y1 = parseFloat(mediaBoxMatch[2])
    const x2 = parseFloat(mediaBoxMatch[3])
    const y2 = parseFloat(mediaBoxMatch[4])
    
    const width = Math.abs(x2 - x1)
    const height = Math.abs(y2 - y1)
    
    // Convertir les points PDF en pixels (72 DPI)
    return {
      width: Math.round(width * 96 / 72),
      height: Math.round(height * 96 / 72)
    }
  }
  
  // Taille A4 par défaut en pixels (96 DPI)
  return { width: 794, height: 1123 }
}

/**
 * Obtient les dimensions d'un fichier EPS
 */
async function getEpsDimensions(buffer: Buffer): Promise<Dimensions> {
  const epsContent = buffer.toString('ascii', 0, 1024) // Lire le début du fichier
  
  // Rechercher la BoundingBox
  const boundingBoxMatch = epsContent.match(/%%BoundingBox:\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)/i)
  
  if (boundingBoxMatch) {
    const x1 = parseFloat(boundingBoxMatch[1])
    const y1 = parseFloat(boundingBoxMatch[2])
    const x2 = parseFloat(boundingBoxMatch[3])
    const y2 = parseFloat(boundingBoxMatch[4])
    
    const width = Math.abs(x2 - x1)
    const height = Math.abs(y2 - y1)
    
    // Convertir les points PostScript en pixels (72 DPI)
    return {
      width: Math.round(width * 96 / 72),
      height: Math.round(height * 96 / 72)
    }
  }
  
  // Taille par défaut
  return { width: 612, height: 792 }
}

/**
 * Obtient les dimensions d'un fichier PSD
 */
async function getPsdDimensions(buffer: Buffer): Promise<Dimensions> {
  // Structure simplifiée du header PSD
  if (buffer.length < 26) {
    throw new Error('Fichier PSD invalide')
  }
  
  // Vérifier la signature
  const signature = buffer.toString('ascii', 0, 4)
  if (signature !== '8BPS') {
    throw new Error('Fichier PSD invalide')
  }
  
  // Lire les dimensions (big-endian)
  const height = buffer.readUInt32BE(14)
  const width = buffer.readUInt32BE(18)
  
  if (width > 0 && height > 0 && width < 300000 && height < 300000) {
    return { width, height }
  }
  
  throw new Error('Dimensions PSD invalides')
}

/**
 * Obtient les dimensions d'un fichier AI (Adobe Illustrator)
 */
async function getAiDimensions(buffer: Buffer): Promise<Dimensions> {
  // Les fichiers AI modernes sont souvent des PDF
  const content = buffer.toString('ascii', 0, 1024)
  
  if (content.includes('%PDF')) {
    return getPdfDimensions(buffer)
  }
  
  // Rechercher la BoundingBox pour les anciens formats AI
  const boundingBoxMatch = content.match(/%%BoundingBox:\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)/i)
  
  if (boundingBoxMatch) {
    const x1 = parseFloat(boundingBoxMatch[1])
    const y1 = parseFloat(boundingBoxMatch[2])
    const x2 = parseFloat(boundingBoxMatch[3])
    const y2 = parseFloat(boundingBoxMatch[4])
    
    const width = Math.abs(x2 - x1)
    const height = Math.abs(y2 - y1)
    
    return {
      width: Math.round(width * 96 / 72),
      height: Math.round(height * 96 / 72)
    }
  }
  
  // Taille par défaut
  return { width: 612, height: 792 }
}

/**
 * Valide les dimensions d'un fichier
 */
export function validateFileDimensions(dimensions: Dimensions): boolean {
  const dimensionsMm = {
    width: dimensions.width * CONSTANTS.PX_TO_MM,
    height: dimensions.height * CONSTANTS.PX_TO_MM
  }
  
  return (
    dimensionsMm.width >= CONSTANTS.MIN_ELEMENT_SIZE &&
    dimensionsMm.width <= CONSTANTS.MAX_ELEMENT_SIZE &&
    dimensionsMm.height >= CONSTANTS.MIN_ELEMENT_SIZE &&
    dimensionsMm.height <= CONSTANTS.MAX_ELEMENT_SIZE
  )
}