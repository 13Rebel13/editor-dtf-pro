import { Request, Response, NextFunction } from 'express'
import { createApiError } from './errorHandler'

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = createApiError(
    `Route non trouvée: ${req.method} ${req.originalUrl}`,
    404,
    'ROUTE_NOT_FOUND'
  )
  
  next(error)
}