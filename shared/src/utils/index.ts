/**
 * Utilitaires partagés pour l'éditeur de planches DTF
 */

import { CONSTANTS, Dimensions, PlateFormat, PLATE_DIMENSIONS_MM } from '../types';

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Génère un nom de fichier aléatoire avec extension
 */
export function generateRandomFileName(originalName: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const randomName = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return `${randomName}_${timestamp}.${extension}`;
}

/**
 * Convertit des millimètres en pixels
 */
export function mmToPixels(mm: number): number {
  return mm * CONSTANTS.MM_TO_PX;
}

/**
 * Convertit des pixels en millimètres
 */
export function pixelsToMm(pixels: number): number {
  return pixels * CONSTANTS.PX_TO_MM;
}

/**
 * Applique le facteur d'échelle pour l'affichage
 */
export function applyScale(value: number): number {
  return value * CONSTANTS.SCALE_FACTOR;
}

/**
 * Retire le facteur d'échelle
 */
export function removeScale(value: number): number {
  return value / CONSTANTS.SCALE_FACTOR;
}

/**
 * Calcule les dimensions en pixels à partir des dimensions en mm
 */
export function dimensionsMmToPixels(dimensionsMm: Dimensions): Dimensions {
  return {
    width: mmToPixels(dimensionsMm.width),
    height: mmToPixels(dimensionsMm.height)
  };
}

/**
 * Calcule les dimensions en mm à partir des dimensions en pixels
 */
export function dimensionsPixelsToMm(dimensionsPixels: Dimensions): Dimensions {
  return {
    width: pixelsToMm(dimensionsPixels.width),
    height: pixelsToMm(dimensionsPixels.height)
  };
}

/**
 * Calcule la surface d'un élément en mm²
 */
export function calculateAreaMm(dimensions: Dimensions): number {
  const dimensionsMm = dimensionsPixelsToMm(dimensions);
  return dimensionsMm.width * dimensionsMm.height;
}

/**
 * Calcule la surface totale d'une planche en mm²
 */
export function getPlateAreaMm(format: PlateFormat): number {
  const dimensions = PLATE_DIMENSIONS_MM[format];
  return dimensions.width * dimensions.height;
}

/**
 * Redimensionne des dimensions en conservant le ratio
 */
export function resizeWithRatio(
  currentDimensions: Dimensions,
  targetWidth?: number,
  targetHeight?: number
): Dimensions {
  const ratio = currentDimensions.width / currentDimensions.height;
  
  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: targetWidth / ratio
    };
  }
  
  if (!targetWidth && targetHeight) {
    return {
      width: targetHeight * ratio,
      height: targetHeight
    };
  }
  
  if (targetWidth && targetHeight) {
    // Choisir la dimension qui respecte le mieux le ratio
    const ratioByWidth = targetWidth / ratio;
    const ratioByHeight = targetHeight * ratio;
    
    if (ratioByWidth <= targetHeight) {
      return {
        width: targetWidth,
        height: ratioByWidth
      };
    } else {
      return {
        width: ratioByHeight,
        height: targetHeight
      };
    }
  }
  
  return currentDimensions;
}

/**
 * Vérifie si un élément dépasse les limites d'une planche
 */
export function isElementOutOfBounds(
  position: { x: number; y: number },
  dimensions: Dimensions,
  plateFormat: PlateFormat
): boolean {
  const plateDimensions = PLATE_DIMENSIONS_MM[plateFormat];
  const plateDimensionsPixels = dimensionsMmToPixels(plateDimensions);
  
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x + dimensions.width > plateDimensionsPixels.width ||
    position.y + dimensions.height > plateDimensionsPixels.height
  );
}

/**
 * Calcule l'efficacité d'utilisation d'une planche
 */
export function calculatePlateEfficiency(
  usedArea: number,
  plateFormat: PlateFormat
): number {
  const totalArea = getPlateAreaMm(plateFormat);
  return Math.round((usedArea / totalArea) * 100);
}

/**
 * Formate une taille de fichier en format lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Valide les dimensions d'un élément
 */
export function validateDimensions(dimensions: Dimensions): boolean {
  const dimensionsMm = dimensionsPixelsToMm(dimensions);
  
  return (
    dimensionsMm.width >= CONSTANTS.MIN_ELEMENT_SIZE &&
    dimensionsMm.width <= CONSTANTS.MAX_ELEMENT_SIZE &&
    dimensionsMm.height >= CONSTANTS.MIN_ELEMENT_SIZE &&
    dimensionsMm.height <= CONSTANTS.MAX_ELEMENT_SIZE
  );
}

/**
 * Clamp une valeur entre min et max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Arrondit un nombre à n décimales
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Vérifie si deux rectangles se chevauchent
 */
export function doRectanglesOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number },
  margin: number = 0
): boolean {
  return !(
    rect1.x + rect1.width + margin <= rect2.x ||
    rect2.x + rect2.width + margin <= rect1.x ||
    rect1.y + rect1.height + margin <= rect2.y ||
    rect2.y + rect2.height + margin <= rect1.y
  );
}

/**
 * Trouve une position libre pour un élément sur une planche
 */
export function findFreePosition(
  dimensions: Dimensions,
  existingElements: Array<{ x: number; y: number; width: number; height: number }>,
  plateFormat: PlateFormat,
  margin: number = mmToPixels(CONSTANTS.DEFAULT_SPACING)
): { x: number; y: number } | null {
  const plateDimensions = PLATE_DIMENSIONS_MM[plateFormat];
  const plateDimensionsPixels = dimensionsMmToPixels(plateDimensions);
  
  const step = Math.max(10, margin);
  
  for (let y = 0; y <= plateDimensionsPixels.height - dimensions.height; y += step) {
    for (let x = 0; x <= plateDimensionsPixels.width - dimensions.width; x += step) {
      const newRect = {
        x,
        y,
        width: dimensions.width,
        height: dimensions.height
      };
      
      const hasOverlap = existingElements.some(element =>
        doRectanglesOverlap(newRect, element, margin)
      );
      
      if (!hasOverlap) {
        return { x, y };
      }
    }
  }
  
  return null;
}

/**
 * Calcule la rotation normalisée (0-360°)
 */
export function normalizeRotation(rotation: number): number {
  return ((rotation % 360) + 360) % 360;
}

/**
 * Arrondit une rotation au pas le plus proche
 */
export function snapRotation(rotation: number, step: number): number {
  return Math.round(rotation / step) * step;
}

/**
 * Débounce une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle une fonction
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}