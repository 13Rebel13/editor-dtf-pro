import type { Node } from 'konva/lib/Node';

// === FORMATS DE PLANCHES DTF ===
export interface DTFPlateFormat {
  id: string;
  name: string;
  width: number; // en pixels à 300 DPI
  height: number; // en pixels à 300 DPI
  widthCm: number;
  heightCm: number;
  description: string;
  isPrimary: boolean;
}

export const DTF_PLATE_FORMATS: DTFPlateFormat[] = [
  {
    id: '55x100',
    name: '55×100cm',
    width: 6496,
    height: 11811,
    widthCm: 55,
    heightCm: 100,
    description: 'Format principal professionnel',
    isPrimary: true
  },
  {
    id: '55x50',
    name: '55×50cm',
    width: 6496,
    height: 5906,
    widthCm: 55,
    heightCm: 50,
    description: 'Demi-format optimisé',
    isPrimary: false
  },
  {
    id: 'a3',
    name: 'A3',
    width: 3508,
    height: 4961,
    widthCm: 29.7,
    heightCm: 42,
    description: 'Format test et prototype',
    isPrimary: false
  }
];

// === TYPES D'ARRIÈRE-PLANS ===
export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'texture' | 'image';

export interface SolidBackground {
  type: 'solid';
  color: string;
}

export interface GradientBackground {
  type: 'gradient';
  gradientType: 'linear' | 'radial' | 'conic';
  colors: Array<{
    color: string;
    stop: number;
  }>;
  angle?: number; // pour gradients linéaires
  centerX?: number; // pour gradients radiaux/coniques
  centerY?: number; // pour gradients radiaux/coniques
  radius?: number; // pour gradients radiaux
}

export interface PatternBackground {
  type: 'pattern';
  patternType: 'dots' | 'stripes' | 'checkerboard' | 'hexagon' | 'triangles';
  primaryColor: string;
  secondaryColor: string;
  size: number;
  rotation?: number;
}

export interface TextureBackground {
  type: 'texture';
  textureType: 'wood' | 'metal' | 'fabric' | 'paper' | 'concrete' | 'marble';
  url: string;
  scale: number;
  opacity: number;
}

export interface ImageBackground {
  type: 'image';
  url: string;
  fit: 'cover' | 'contain' | 'fill' | 'repeat';
  opacity: number;
}

export type Background = 
  | SolidBackground 
  | GradientBackground 
  | PatternBackground 
  | TextureBackground 
  | ImageBackground;

// === ÉLÉMENTS DU CANVAS ===
export interface BaseElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  name: string;
  zIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  filters?: Array<{
    type: string;
    value: number;
  }>;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: 'normal' | 'italic';
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  align: 'left' | 'center' | 'right' | 'justify';
  verticalAlign: 'top' | 'middle' | 'bottom';
  lineHeight: number;
  letterSpacing: number;
  padding: number;
  textPath?: {
    enabled: boolean;
    path: string;
    offset: number;
  };
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'ellipse' | 'polygon' | 'star' | 'arrow';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number; // pour rectangles
  sides?: number; // pour polygones/étoiles
  points?: number[]; // pour formes personnalisées
}

export interface GroupElement extends BaseElement {
  type: 'group';
  children: CanvasElement[];
}

export type CanvasElement = ImageElement | TextElement | ShapeElement | GroupElement;

// === CALQUES ===
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  elements: CanvasElement[];
  zIndex: number;
}

// === PROJET DTF ===
export interface DTFProject {
  id: string;
  name: string;
  description?: string;
  format: DTFPlateFormat;
  background: Background;
  layers: Layer[];
  zoom: number;
  panX: number;
  panY: number;
  gridVisible: boolean;
  guidesVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    version: string;
    dpi: number;
    colorProfile: string;
    bleed: number; // en mm
  };
}

// === CANVAS STATE ===
export interface CanvasState {
  project: DTFProject | null;
  selectedElements: string[];
  clipboard: CanvasElement[];
  history: {
    past: DTFProject[];
    present: DTFProject | null;
    future: DTFProject[];
  };
  tool: 'select' | 'text' | 'shape' | 'image' | 'pan' | 'zoom';
  isDrawing: boolean;
  isDragging: boolean;
  showGrid: boolean;
  showGuides: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  snapToGuides: boolean;
}

// === UTILITAIRES ===
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  skewX: number;
  skewY: number;
}

// === ÉVÉNEMENTS ===
export interface CanvasEvent {
  type: string;
  target?: CanvasElement;
  position?: Point;
  delta?: Point;
  scale?: number;
  data?: any;
}

// === EXPORT ===
export interface ExportOptions {
  format: 'svg' | 'png' | 'pdf';
  quality: number; // 0-1 pour PNG, ignoré pour SVG/PDF
  dpi: number;
  includeBackground: boolean;
  includeMetadata: boolean;
  compression?: 'none' | 'lzw' | 'zip';
  colorProfile?: string;
}

export interface ExportResult {
  success: boolean;
  data?: Blob;
  url?: string;
  error?: string;
  metadata?: {
    format: string;
    size: number;
    dimensions: Size;
    dpi: number;
  };
}