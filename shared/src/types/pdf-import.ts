// === IMPORT PDF ===
export interface PDFImportOptions {
  preserveVectors: boolean;
  extractText: boolean;
  extractImages: boolean;
  targetDPI: number;
  maxWidth?: number;
  maxHeight?: number;
  pageRange?: {
    start: number;
    end: number;
  };
}

export interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  elements: PDFElement[];
  thumbnail?: string; // base64
}

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'vector' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  data: PDFTextData | PDFImageData | PDFVectorData | PDFShapeData;
}

export interface PDFTextData {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
}

export interface PDFImageData {
  src: string; // base64 ou URL
  originalFormat: string;
  compression: number;
  colorSpace: string;
}

export interface PDFVectorData {
  svg: string;
  paths: Array<{
    d: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }>;
}

export interface PDFShapeData {
  shapeType: 'rectangle' | 'circle' | 'line' | 'polygon';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  points?: number[];
}

export interface PDFImportResult {
  success: boolean;
  pages: PDFPage[];
  metadata: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    pageCount: number;
    version: string;
    encrypted: boolean;
  };
  warnings: string[];
  errors: string[];
}

export interface PDFImportProgress {
  phase: 'parsing' | 'extracting' | 'converting' | 'optimizing' | 'complete';
  progress: number; // 0-100
  currentPage?: number;
  totalPages?: number;
  message: string;
}