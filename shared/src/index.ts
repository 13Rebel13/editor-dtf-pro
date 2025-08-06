/**
 * Point d'entrée principal pour les types et utilitaires partagés
 */

export * from './types/index.js';
export * from './types/pdf-import.js';
export * from './types/analyzer.js';
export * from './types/fonts.js';

// Export des enums et constantes
export {
  PlateFormat,
  PLATE_DIMENSIONS,
  PLATE_DIMENSIONS_MM,
  FileType,
  MIME_TYPES,
  BackgroundType,
  ErrorCode,
  CONSTANTS
} from './types';

// Export des utilitaires
export {
  generateId,
  generateRandomFileName,
  mmToPixels,
  pixelsToMm,
  applyScale,
  removeScale,
  dimensionsMmToPixels,
  dimensionsPixelsToMm,
  calculateAreaMm,
  getPlateAreaMm,
  resizeWithRatio,
  isElementOutOfBounds,
  calculatePlateEfficiency,
  formatFileSize,
  validateDimensions,
  clamp,
  roundTo,
  doRectanglesOverlap,
  findFreePosition,
  normalizeRotation,
  snapRotation,
  debounce,
  throttle
} from './utils';