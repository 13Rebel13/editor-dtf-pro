/**
 * Point d'entrée principal pour les types et utilitaires partagés
 */

// Re-export all types
export * from './types/index'
export * from './types/backend'
export * from './types/pdf-import'
export * from './types/analyzer'
export * from './types/fonts'

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
} from './types/index'

// Export backend types
export type {
  UploadedFile,
  NestingConfig,
  NestingResult,
  Plate,
  PlateElement,
  ExportData,
  ExportConfig,
  ExportResponse,
  DTFWhiteLayerConfig,
  Dimensions
} from './types/backend'

// Note: TextElement est aussi exporté depuis types/index
export type { TextElement } from './types/backend'

// Export enums
export { FileType } from './types/backend'
export { BackgroundType } from './types/index'

// Export constants
export {
  DTF_PLATE_FORMATS
} from './types/index'

export {
  CONSTANTS,
  PLATE_DIMENSIONS_MM
} from './types/backend'

export {
  DTF_ANALYSIS_RULES
} from './types/analyzer'

export {
  DTF_ESSENTIAL_FONTS
} from './types/fonts'

// Export utility functions
export {
  generateRandomFileName,
  generateId,
  mmToPixels,
  pixelsToMm,
  findFreePosition,
  doRectanglesOverlap,
  getPlateAreaMm,
  calculateAreaMm
} from './types/backend'

// Export PlateFormat from services for compatibility
export type PlateFormat = string