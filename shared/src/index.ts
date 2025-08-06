/**
 * Point d'entrée principal pour les types et utilitaires partagés
 */

// Re-export all types
export * from './types/index.js'
export * from './types/pdf-import.js'
export * from './types/analyzer.js'
export * from './types/fonts.js'

// Export type aliases for convenience
export type {
  DTFProject,
  DTFPlateFormat,
  Background,
  CanvasElement,
  CanvasState,
  Layer,
  Point,
  Size,
  Rect,
  Transform,
  CanvasEvent,
  ExportOptions,
  ExportResult
} from './types/index.js'

// Export constants
export {
  DTF_PLATE_FORMATS
} from './types/index.js'

export {
  DTF_ANALYSIS_RULES
} from './types/analyzer.js'

export {
  DTF_ESSENTIAL_FONTS
} from './types/fonts.js'