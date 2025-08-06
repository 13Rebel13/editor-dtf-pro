// === ANALYSEUR DTF ===
export interface DTFAnalysisRule {
  id: string;
  name: string;
  description: string;
  category: 'line_width' | 'spacing' | 'resolution' | 'color' | 'size' | 'positioning';
  severity: 'error' | 'warning' | 'info';
  threshold: number;
  unit: 'mm' | 'px' | 'dpi' | 'percent';
}

export const DTF_ANALYSIS_RULES: DTFAnalysisRule[] = [
  {
    id: 'min_line_width',
    name: 'Largeur minimale des traits',
    description: 'Les traits doivent faire au minimum 0.5mm pour être imprimés correctement',
    category: 'line_width',
    severity: 'error',
    threshold: 0.5,
    unit: 'mm'
  },
  {
    id: 'min_element_spacing',
    name: 'Espacement minimum entre éléments',
    description: 'Les éléments doivent être espacés d\'au moins 1mm',
    category: 'spacing',
    severity: 'warning',
    threshold: 1,
    unit: 'mm'
  },
  {
    id: 'min_text_size',
    name: 'Taille minimale du texte',
    description: 'Le texte doit faire au minimum 1.5mm de hauteur',
    category: 'size',
    severity: 'warning',
    threshold: 1.5,
    unit: 'mm'
  },
  {
    id: 'resolution_check',
    name: 'Résolution des images',
    description: 'Les images doivent avoir une résolution d\'au moins 300 DPI',
    category: 'resolution',
    severity: 'error',
    threshold: 300,
    unit: 'dpi'
  },
  {
    id: 'color_space',
    name: 'Espace colorimétrique',
    description: 'Vérification de l\'espace colorimétrique pour l\'impression DTF',
    category: 'color',
    severity: 'info',
    threshold: 0,
    unit: 'percent'
  }
];

export interface DTFAnalysisIssue {
  id: string;
  ruleId: string;
  elementId: string;
  elementType: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  description: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  value: number;
  threshold: number;
  unit: string;
  suggestion?: string;
  autoFixable: boolean;
}

export interface DTFAnalysisResult {
  projectId: string;
  analyzedAt: Date;
  duration: number; // en ms
  summary: {
    totalElements: number;
    elementsAnalyzed: number;
    issues: {
      errors: number;
      warnings: number;
      infos: number;
    };
    overallScore: number; // 0-100
    printReady: boolean;
  };
  issues: DTFAnalysisIssue[];
  statistics: {
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    byElementType: Record<string, number>;
  };
  recommendations: string[];
}

export interface DTFAnalysisOptions {
  rules: string[]; // IDs des règles à appliquer
  includeWarnings: boolean;
  includeInfos: boolean;
  autoHighlight: boolean;
  generateReport: boolean;
}

export interface DTFQualityMetrics {
  lineWidthCompliance: number; // 0-100
  spacingCompliance: number; // 0-100
  resolutionCompliance: number; // 0-100
  colorCompliance: number; // 0-100
  overallQuality: number; // 0-100
  printReadiness: 'ready' | 'review_needed' | 'issues_found';
}

// === HIGHLIGHTING VISUEL ===
export interface AnalysisHighlight {
  id: string;
  issueId: string;
  elementId: string;
  type: 'outline' | 'overlay' | 'annotation';
  color: string;
  opacity: number;
  animated: boolean;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  tooltip?: {
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
}

// === RAPPORT D'ANALYSE ===
export interface DTFAnalysisReport {
  id: string;
  projectName: string;
  generatedAt: Date;
  analysis: DTFAnalysisResult;
  format: DTFPlateFormat;
  summary: {
    title: string;
    subtitle: string;
    description: string;
  };
  sections: Array<{
    title: string;
    content: string;
    charts?: Array<{
      type: 'pie' | 'bar' | 'line';
      title: string;
      data: any;
    }>;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    steps: string[];
  }>;
  exportOptions: {
    includeThumbnails: boolean;
    includeCharts: boolean;
    includeRecommendations: boolean;
    format: 'pdf' | 'html' | 'json';
  };
}