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

// Security headers
app.use(helmet({
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
  },
  crossOriginEmbedderPolicy: false
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
app.use(compression() as any)

// Rate limiting pour les routes API
app.use('/api', limiter as any)

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

// Servir les fichiers uploadés localement
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}))

// API Routes
setupRoutes(app)

// Servir les fichiers statiques du frontend
const frontendPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '../../') // En dev, utiliser la racine du workspace

app.use(express.static(frontendPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true
}))

// Fallback pour les routes SPA (seulement pour les routes non-API)
app.get('*', (req, res) => {
  // Ne pas intercepter les routes API, uploads, ou health
  if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: 'Route non trouvée' })
  }
  
  const indexPath = path.join(frontendPath, 'dtf-editor.html')
  res.sendFile(indexPath, (err) => {
    if (err) {
      logger.error('Erreur lors de l\'envoi de dtf-editor.html:', err)
      res.status(500).json({ error: 'Erreur serveur' })
    }
  })
})

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