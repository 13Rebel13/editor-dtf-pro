import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createApiError } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

// Configuration du client S3 pour Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
  }
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'dtf-editor-files'
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || ''

/**
 * Upload un fichier vers Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'max-age=31536000', // 1 an
      Metadata: {
        uploadedAt: new Date().toISOString()
      }
    })

    await r2Client.send(command)
    
    // Construire l'URL publique
    const publicUrl = `${PUBLIC_URL}/${fileName}`
    
    logger.debug(`Fichier uploadé vers R2: ${fileName}`)
    
    return publicUrl

  } catch (error) {
    logger.error('Erreur upload R2:', error)
    throw createApiError(
      'Erreur lors de l\'upload du fichier',
      500,
      'R2_UPLOAD_ERROR'
    )
  }
}

/**
 * Supprime un fichier de Cloudflare R2
 */
export async function deleteFromR2(fileName: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName
    })

    await r2Client.send(command)
    
    logger.debug(`Fichier supprimé de R2: ${fileName}`)

  } catch (error) {
    logger.error('Erreur suppression R2:', error)
    throw createApiError(
      'Erreur lors de la suppression du fichier',
      500,
      'R2_DELETE_ERROR'
    )
  }
}

/**
 * Génère une URL signée pour un accès temporaire
 */
export async function getSignedUrlForFile(
  fileName: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
    
    return signedUrl

  } catch (error) {
    logger.error('Erreur génération URL signée:', error)
    throw createApiError(
      'Erreur lors de la génération de l\'URL signée',
      500,
      'R2_SIGNED_URL_ERROR'
    )
  }
}

/**
 * Vérifie si un fichier existe dans R2
 */
export async function fileExistsInR2(fileName: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName
    })

    await r2Client.send(command)
    return true

  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return false
    }
    
    logger.error('Erreur vérification existence R2:', error)
    throw createApiError(
      'Erreur lors de la vérification du fichier',
      500,
      'R2_CHECK_ERROR'
    )
  }
}

/**
 * Télécharge un fichier depuis R2
 */
export async function downloadFromR2(fileName: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName
    })

    const response = await r2Client.send(command)
    
    if (!response.Body) {
      throw createApiError(
        'Fichier vide ou non trouvé',
        404,
        'FILE_NOT_FOUND'
      )
    }

    // Convertir le stream en buffer
    const chunks: Buffer[] = []
    const stream = response.Body as any
    
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    
    return Buffer.concat(chunks)

  } catch (error) {
    logger.error('Erreur téléchargement R2:', error)
    throw createApiError(
      'Erreur lors du téléchargement du fichier',
      500,
      'R2_DOWNLOAD_ERROR'
    )
  }
}