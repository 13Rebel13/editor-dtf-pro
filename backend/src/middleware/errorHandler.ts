import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log de l'erreur
  logger.error('Erreur API:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  })

  // Déterminer le code de statut
  const statusCode = err.statusCode || 500

  // Message d'erreur selon l'environnement
  const message = process.env.NODE_ENV === 'production' 
    ? getProductionErrorMessage(statusCode)
    : err.message

  // Réponse JSON
  const errorResponse: any = {
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }
  }

  // Ajouter la stack trace en développement
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack
  }

  res.status(statusCode).json(errorResponse)
}

function getProductionErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Requête invalide'
    case 401:
      return 'Non autorisé'
    case 403:
      return 'Accès interdit'
    case 404:
      return 'Ressource non trouvée'
    case 413:
      return 'Fichier trop volumineux'
    case 429:
      return 'Trop de requêtes'
    case 500:
    default:
      return 'Erreur interne du serveur'
  }
}

// Helper pour créer des erreurs API
export function createApiError(
  message: string, 
  statusCode: number = 500, 
  code?: string
): ApiError {
  const error = new Error(message) as ApiError
  error.statusCode = statusCode
  error.code = code
  return error
}