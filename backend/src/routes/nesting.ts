import { Router, Request, Response, NextFunction } from 'express'
import { NestingConfig, NestingResult, UploadedFile } from '@dtf-editor/shared'
import { createApiError } from '../middleware/errorHandler'
import { optimizePlacement } from '../services/nestingAlgorithm'
import { logger } from '../utils/logger'

const router = Router()

/**
 * POST /api/nesting/optimize
 * Optimise automatiquement le placement des éléments
 */
router.post('/optimize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { files, config }: { files: UploadedFile[], config: NestingConfig } = req.body

    if (!files || files.length === 0) {
      throw createApiError(
        'Aucun fichier fourni pour l\'optimisation',
        400,
        'NO_FILES_PROVIDED'
      )
    }

    if (!config || !config.plateFormat) {
      throw createApiError(
        'Configuration d\'optimisation requise',
        400,
        'NESTING_CONFIG_REQUIRED'
      )
    }

    logger.info(`Début optimisation pour ${files.length} fichier(s)`)

    // Exécuter l'algorithme d'optimisation
    const result = await optimizePlacement(files, config)

    logger.info(`Optimisation terminée: ${result.plates.length} planche(s), efficacité ${result.efficiency}%`)

    res.json({
      success: true,
      result,
      message: `Optimisation réussie: ${result.plates.length} planche(s) générée(s)`
    })

  } catch (error) {
    logger.error('Erreur optimisation:', error)
    next(error)
  }
})

/**
 * POST /api/nesting/calculate-efficiency
 * Calcule l'efficacité d'un placement donné
 */
router.post('/calculate-efficiency', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plates, files } = req.body

    if (!plates || !Array.isArray(plates) || plates.length === 0) {
      throw createApiError(
        'Planches requises pour le calcul d\'efficacité',
        400,
        'PLATES_REQUIRED'
      )
    }

    // TODO: Implémenter le calcul d'efficacité
    const efficiency = 75 // Valeur temporaire

    res.json({
      success: true,
      efficiency,
      details: {
        totalArea: 0,
        usedArea: 0,
        unusedArea: 0
      }
    })

  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/nesting/suggest-improvements
 * Suggère des améliorations pour le placement actuel
 */
router.post('/suggest-improvements', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plates, files } = req.body

    if (!plates || !Array.isArray(plates)) {
      throw createApiError(
        'Planches requises pour les suggestions',
        400,
        'PLATES_REQUIRED'
      )
    }

    // TODO: Implémenter les suggestions d'amélioration
    res.json({
      success: true,
      suggestions: [
        {
          type: 'rotation',
          elementId: 'example-id',
          description: 'Rotation de 90° pour économiser 15% d\'espace',
          potentialSavings: 15
        }
      ],
      message: 'Suggestions d\'amélioration calculées'
    })

  } catch (error) {
    next(error)
  }
})

export { router as nestingRouter }