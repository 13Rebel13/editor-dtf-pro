/**
 * Types partagés pour l'éditeur de planches DTF
 */

// Formats de planches supportés
export enum PlateFormat {
  LARGE = '55x100',    // 55 × 100 cm
  MEDIUM = '55x50',    // 55 × 50 cm
  A3 = 'A3'            // A3
}

// Dimensions des planches en pixels (échelle 1:2)
export const PLATE_DIMENSIONS = {
  [PlateFormat.LARGE]: { width: 1654, height: 3937 },
  [PlateFormat.MEDIUM]: { width: 1654, height: 1968 },
  [PlateFormat.A3]: { width: 1240, height: 1754 }
} as const;

// Dimensions réelles en millimètres
export const PLATE_DIMENSIONS_MM = {
  [PlateFormat.LARGE]: { width: 550, height: 1000 },
  [PlateFormat.MEDIUM]: { width: 550, height: 500 },
  [PlateFormat.A3]: { width: 297, height: 420 }
} as const;

// Types de fichiers supportés
export enum FileType {
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  WEBP = 'webp',
  PDF = 'pdf',
  SVG = 'svg',
  EPS = 'eps',
  PSD = 'psd',
  AI = 'ai'
}

// MIME types correspondants
export const MIME_TYPES = {
  [FileType.PNG]: 'image/png',
  [FileType.JPG]: 'image/jpeg',
  [FileType.JPEG]: 'image/jpeg',
  [FileType.WEBP]: 'image/webp',
  [FileType.PDF]: 'application/pdf',
  [FileType.SVG]: 'image/svg+xml',
  [FileType.EPS]: 'application/postscript',
  [FileType.PSD]: 'image/vnd.adobe.photoshop',
  [FileType.AI]: 'application/illustrator'
} as const;

// Position d'un élément sur la planche
export interface Position {
  x: number;
  y: number;
}

// Dimensions d'un élément
export interface Dimensions {
  width: number;
  height: number;
}

// Fichier uploadé
export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;        // Nom aléatoire généré
  url: string;            // URL Cloudflare R2
  fileType: FileType;
  size: number;           // Taille en bytes
  dimensions: Dimensions; // Dimensions en pixels
  dimensionsMm: Dimensions; // Dimensions en millimètres
  uploadedAt: Date;
}

// Élément placé sur la planche
export interface PlateElement {
  id: string;
  fileId: string;         // Référence au fichier uploadé
  position: Position;     // Position en pixels
  dimensions: Dimensions; // Dimensions en pixels
  rotation: number;       // Rotation en degrés
  keepRatio: boolean;     // Conserver le ratio lors du redimensionnement
  zIndex: number;         // Ordre d'affichage
  plateId: string;        // ID de la planche
}

// Élément de texte
export interface TextElement {
  id: string;
  content: string;
  position: Position;
  fontSize: number;       // Taille en points
  fontFamily: string;
  color: string;          // Couleur hex
  rotation: number;
  plateId: string;
  zIndex: number;
}

// Planche de travail
export interface Plate {
  id: string;
  format: PlateFormat;
  elements: PlateElement[];
  textElements: TextElement[];
  backgroundType: BackgroundType;
  createdAt: Date;
  updatedAt: Date;
}

// Types de fond disponibles
export enum BackgroundType {
  GRID_LIGHT = 'grid-light',
  GRID_DARK = 'grid-dark',
  DOTS = 'dots'
}

// Projet (ensemble de planches)
export interface Project {
  id: string;
  name: string;
  plates: Plate[];
  createdAt: Date;
  updatedAt: Date;
}

// Configuration pour l'optimisation automatique
export interface NestingConfig {
  plateFormat: PlateFormat;
  allowRotation: boolean;
  rotationStep: number;    // Pas de rotation en degrés (ex: 15°)
  minSpacing: number;      // Espacement minimal en mm (6mm requis)
  maxPlates?: number;      // Nombre max de planches à générer
}

// Résultat de l'optimisation
export interface NestingResult {
  plates: Plate[];
  efficiency: number;      // Pourcentage d'utilisation
  totalArea: number;       // Surface totale utilisée
  unusedArea: number;      // Surface restante
}

// Données pour l'export PDF
export interface ExportData {
  plates: Plate[];
  files: UploadedFile[];
  textElements: TextElement[];
  format: PlateFormat;
}

// Configuration d'export PDF
export interface ExportConfig {
  quality: 'high' | 'medium' | 'low';
  colorSpace: 'rgb' | 'cmyk';
  includeBleed: boolean;
  bleedSize: number;       // Taille du fond perdu en mm
}

// Réponse d'export PDF
export interface ExportResponse {
  success: boolean;
  pdfUrls: string[];       // URLs des PDFs générés
  message?: string;
  error?: string;
}

// Statistiques d'utilisation d'une planche
export interface PlateStats {
  usedArea: number;        // Surface utilisée en mm²
  totalArea: number;       // Surface totale en mm²
  efficiency: number;      // Pourcentage d'utilisation
  elementCount: number;    // Nombre d'éléments
  textElementCount: number; // Nombre d'éléments de texte
}

// Configuration de redimensionnement avant ajout
export interface ResizeConfig {
  width: number;           // Largeur en mm
  height: number;          // Hauteur en mm
  keepRatio: boolean;
  quantity: number;        // Nombre d'occurrences
}

// Erreurs spécifiques
export enum ErrorCode {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  INVALID_DIMENSIONS = 'INVALID_DIMENSIONS',
  PLATE_OVERFLOW = 'PLATE_OVERFLOW',
  EXPORT_FAILED = 'EXPORT_FAILED',
  NESTING_FAILED = 'NESTING_FAILED'
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
}

// Configuration de l'application
export interface AppConfig {
  maxFileSize: number;     // Taille max en bytes
  maxFilesPerProject: number;
  allowedFileTypes: FileType[];
  cloudflareR2: {
    bucketName: string;
    publicUrl: string;
  };
  export: {
    maxPlatesPerExport: number;
    timeout: number;       // Timeout en ms
  };
}

// Constantes utiles
export const CONSTANTS = {
  MIN_ELEMENT_SIZE: 5,     // Taille minimale d'un élément en mm
  MAX_ELEMENT_SIZE: 1000,  // Taille maximale d'un élément en mm
  DEFAULT_SPACING: 6,      // Espacement par défaut en mm
  SCALE_FACTOR: 0.5,       // Facteur d'échelle pour l'affichage (1:2)
  DPI: 300,                // DPI pour la conversion mm/pixels
  MM_TO_PX: 3.779527559,   // Conversion mm vers pixels à 96 DPI
  PX_TO_MM: 0.26458333333  // Conversion pixels vers mm à 96 DPI
} as const;