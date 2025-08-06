// Types spécifiques au backend

// === TYPES DE FICHIERS ===
export enum FileType {
  SVG = 'svg',
  PNG = 'png',
  JPEG = 'jpeg',
  JPG = 'jpg',
  PDF = 'pdf',
  AI = 'ai',
  EPS = 'eps',
  WEBP = 'webp',
  PSD = 'psd'
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  fileName: string; // Pour compatibilité avec le backend existant
  originalName: string;
  type: FileType;
  size: number;
  dimensions: Dimensions;
  dimensionsMm?: Dimensions; // Dimensions en mm
  url: string;
  metadata?: {
    dpi?: number;
    colorProfile?: string;
    hasTransparency?: boolean;
  };
  uploadedAt: Date;
}

// === CONFIGURATION DE NESTING ===
export interface NestingConfig {
  plateWidth: number; // en mm
  plateHeight: number; // en mm
  plateFormat: string; // Format de plaque (ex: '55x100')
  margin: number; // en mm
  spacing: number; // en mm entre les fichiers
  minSpacing?: number; // Alias pour spacing pour compatibilité
  rotation: boolean; // autoriser la rotation
  allowRotation?: boolean; // Alias pour rotation pour compatibilité
  rotationStep?: number; // Pas de rotation en degrés
  algorithm: 'basic' | 'advanced' | 'genetic';
  optimization: 'speed' | 'quality' | 'balanced';
  maxAttempts?: number;
  maxPlates?: number; // Nombre maximum de planches
  timeout?: number; // en secondes
}

export interface NestingResult {
  success: boolean;
  plates: Plate[];
  efficiency: number; // pourcentage d'utilisation
  totalArea: number; // aire totale utilisée en mm²
  wastedArea: number; // aire gaspillée en mm²
  unusedArea?: number; // Alias pour wastedArea
  executionTime: number; // en ms
  error?: string;
}

export interface Plate {
  id: string;
  index: number;
  format?: string; // Format de la plaque pour compatibilité
  elements: PlateElement[];
  dimensions: Dimensions;
  efficiency: number;
  totalArea: number;
}

export interface PlateElement {
  id: string;
  fileId: string;
  fileName: string;
  x: number; // position en mm
  y: number; // position en mm
  width: number; // taille en mm
  height: number; // taille en mm
  rotation: number; // en degrés
  scale: number;
  originalDimensions: Dimensions;
  dimensions?: Dimensions; // Pour compatibilité
  position?: { x: number; y: number }; // Position alternative
}

// === EXPORT ===
export interface ExportData {
  plates: Plate[];
  files: UploadedFile[];
  textElements?: TextElement[];
  config: ExportConfig;
}

export interface ExportConfig {
  format: 'pdf' | 'svg' | 'png';
  dpi: number;
  quality?: 'low' | 'medium' | 'high'; // Qualité d'export
  includeWhiteLayer: boolean;
  includeBleed?: boolean; // Inclure le débord
  bleedSize?: number; // Taille du débord en mm
  whiteLayerConfig?: DTFWhiteLayerConfig;
  dtfWhiteLayers?: DTFWhiteLayerConfig; // Alias pour whiteLayerConfig
  plateFormat: {
    id: string;
    name: string;
    width: number;
    height: number;
    widthCm: number;
    heightCm: number;
    description: string;
    isPrimary: boolean;
  };
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  bleed?: number; // en mm
  cropMarks?: boolean;
  colorProfile?: string;
}

export interface DTFWhiteLayerConfig {
  enabled: boolean;
  opacity: number; // 0-100
  choke: number; // en mm, réduction du contour
  mode: 'auto' | 'manual';
  threshold?: number; // seuil de transparence pour mode auto
  layerCount?: number; // Nombre de couches
  mergeLayer?: boolean; // Fusionner les couches
}

export interface ExportResponse {
  success: boolean;
  files?: string[];
  pdfUrls?: string[]; // Pour compatibilité avec l'existant
  jobId?: string;
  message?: string;
  error?: string;
}

// === TEXT ELEMENTS ===
export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  rotation?: number;
}

// === CONSTANTES ===
export const CONSTANTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES_PER_BATCH: 100,
  SUPPORTED_FORMATS: ['.svg', '.png', '.jpeg', '.jpg', '.pdf', '.ai', '.eps'],
  DEFAULT_DPI: 300,
  MIN_DIMENSION: 10, // mm
  MAX_DIMENSION: 1000, // mm
  MIN_ELEMENT_SIZE: 5, // mm - taille minimale d'un élément
  MAX_ELEMENT_SIZE: 500, // mm - taille maximale d'un élément
  PX_TO_MM: 0.264583, // Conversion pixels vers mm à 96 DPI
} as const;

export const PLATE_DIMENSIONS_MM = {
  '55x100': { width: 550, height: 1000 },
  '55x50': { width: 550, height: 500 },
  'a3': { width: 297, height: 420 },
} as const;

// === UTILITAIRES ===
export function generateRandomFileName(extension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `file_${timestamp}_${random}.${extension}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function mmToPixels(mm: number, dpi: number = 300): number {
  return Math.round((mm * dpi) / 25.4);
}

export function pixelsToMm(pixels: number, dpi: number = 300): number {
  return (pixels * 25.4) / dpi;
}

export function findFreePosition(
  elements: PlateElement[],
  width: number,
  height: number,
  plateWidth: number,
  plateHeight: number,
  spacing: number = 2
): { x: number; y: number } | null {
  // Algorithme simple de placement
  const margin = 5; // mm
  
  for (let y = margin; y <= plateHeight - height - margin; y += spacing) {
    for (let x = margin; x <= plateWidth - width - margin; x += spacing) {
      const rect = { x, y, width, height };
      
      const hasOverlap = elements.some(element => 
        doRectanglesOverlap(rect, {
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height
        })
      );
      
      if (!hasOverlap) {
        return { x, y };
      }
    }
  }
  
  return null;
}

export function doRectanglesOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  );
}

export function getPlateAreaMm(plateFormat: string): number {
  const dimensions = PLATE_DIMENSIONS_MM[plateFormat as keyof typeof PLATE_DIMENSIONS_MM];
  return dimensions ? dimensions.width * dimensions.height : 0;
}

export function calculateAreaMm(width: number, height: number): number;
export function calculateAreaMm(dimensions: Dimensions): number;
export function calculateAreaMm(widthOrDimensions: number | Dimensions, height?: number): number {
  if (typeof widthOrDimensions === 'object') {
    return widthOrDimensions.width * widthOrDimensions.height;
  }
  return widthOrDimensions * (height || 0);
}

// Note: DTFPlateFormat est défini inline dans ExportConfig pour éviter les imports circulaires