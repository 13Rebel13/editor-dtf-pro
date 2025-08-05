import { Router, Request, Response, NextFunction } from 'express'
import { ExportData, ExportConfig, ExportResponse } from '@dtf-editor/shared'
import { createApiError } from '../middleware/errorHandler'
import { generatePDF } from '../services/pdfExport'
import { logger } from '../utils/logger'

const router = Router()

/**
 * POST /api/export/pdf
 * Génère un PDF à partir des données de planches
 */
router.post('/pdf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exportData: ExportData = req.body.data
    const config: ExportConfig = req.body.config || {
      quality: 'high',
      colorSpace: 'rgb',
      includeBleed: false,
      bleedSize: 3
    }

    if (!exportData || !exportData.plates || exportData.plates.length === 0) {
      throw createApiError(
        'Données d\'export invalides ou planches vides',
        400,
        'INVALID_EXPORT_DATA'
      )
    }

    logger.info(`Début export PDF pour ${exportData.plates.length} planche(s)`)

    // Générer les PDFs
    const pdfUrls = await generatePDF(exportData, config)

    const response: ExportResponse = {
      success: true,
      pdfUrls,
      message: `${pdfUrls.length} PDF(s) généré(s) avec succès`
    }

    logger.info(`Export PDF terminé: ${pdfUrls.length} fichier(s)`)

    res.json(response)

  } catch (error) {
    logger.error('Erreur export PDF:', error)
    
    const response: ExportResponse = {
      success: false,
      pdfUrls: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'export'
    }
    
    // Renvoyer une erreur 500 mais avec notre format de réponse
    res.status(500).json(response)
  }
})

/**
 * GET /api/export/status/:jobId
 * Vérification du statut d'un export (pour les exports longs)
 */
router.get('/status/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params

    if (!jobId) {
      throw createApiError('ID de job requis', 400, 'JOB_ID_REQUIRED')
    }

    // TODO: Implémenter le système de jobs asynchrones
    res.json({
      success: true,
      status: 'completed',
      message: 'Fonctionnalité en cours de développement'
    })

  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/export/preview
 * Génère un aperçu des planches sans export complet
 */
router.post('/preview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exportData: ExportData = req.body.data

    if (!exportData || !exportData.plates || exportData.plates.length === 0) {
      throw createApiError(
        'Données d\'aperçu invalides',
        400,
        'INVALID_PREVIEW_DATA'
      )
    }

    // TODO: Implémenter la génération d'aperçu
    res.json({
      success: true,
      previewUrls: [],
      message: 'Fonctionnalité d\'aperçu en cours de développement'
    })

  } catch (error) {
    next(error)
  }
})

export { router as exportRouter }