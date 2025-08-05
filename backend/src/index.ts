import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'

import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import { setupRoutes } from './routes'
import { logger } from './utils/logger'

// Charger les variables d'environnement
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Middlewares de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}))

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 heures
}))

// Compression
app.use(compression())

// Rate limiting
app.use('/api', limiter)

// Parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }))
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API Routes
setupRoutes(app)

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendPath))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
}

// Middleware de gestion d'erreurs
app.use(notFoundHandler)
app.use(errorHandler)

// Démarrage du serveur
const server = app.listen(PORT, () => {
  logger.info(`🚀 Serveur DTF Editor démarré sur le port ${PORT}`)
  logger.info(`📋 Environnement: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🌐 Health check: http://localhost:${PORT}/health`)
  
  if (process.env.NODE_ENV === 'development') {
    logger.info(`🎨 Frontend: http://localhost:3000`)
    logger.info(`🔗 API: http://localhost:${PORT}/api`)
  }
})

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt gracieux du serveur...')
  server.close(() => {
    logger.info('Serveur arrêté')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT reçu, arrêt gracieux du serveur...')
  server.close(() => {
    logger.info('Serveur arrêté')
    process.exit(0)
  })
})

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.error('Erreur non capturée:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesse rejetée non gérée à', promise, 'raison:', reason)
  process.exit(1)
})

export default app