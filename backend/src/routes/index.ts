import { Express } from 'express'
import { filesRouter } from './files'
import { exportRouter } from './export'
import { nestingRouter } from './nesting'

export function setupRoutes(app: Express): void {
  // Préfixe API
  const API_PREFIX = '/api'

  // Routes principales
  app.use(`${API_PREFIX}/files`, filesRouter)
  app.use(`${API_PREFIX}/export`, exportRouter)
  app.use(`${API_PREFIX}/nesting`, nestingRouter)

  // Route de test
  app.get(`${API_PREFIX}/ping`, (req, res) => {
    res.json({
      message: 'pong',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })
  })
}