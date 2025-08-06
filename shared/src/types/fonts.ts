// === POLICES GOOGLE FONTS ===
export interface GoogleFont {
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  preview?: string;
}

export interface FontVariant {
  weight: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  style: 'normal' | 'italic';
  display: string; // ex: "Regular", "Bold", "Light Italic"
}

export interface FontPreview {
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
}

// Polices essentielles pour DTF (minimum 20 familles)
export const DTF_ESSENTIAL_FONTS: GoogleFont[] = [
  // Sans-serif modernes
  {
    family: 'Inter',
    category: 'sans-serif',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin', 'latin-ext'],
    version: 'v13',
    lastModified: '2023-05-11',
    files: {
      '400': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2'
    }
  },
  {
    family: 'Roboto',
    category: 'sans-serif',
    variants: ['100', '300', '400', '500', '700', '900', '100italic', '300italic', '400italic', '500italic', '700italic', '900italic'],
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'vietnamese'],
    version: 'v30',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2'
    }
  },
  {
    family: 'Open Sans',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700', '800', '300italic', '400italic', '500italic', '600italic', '700italic', '800italic'],
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'vietnamese'],
    version: 'v34',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVIGxA.woff2'
    }
  },

  // Serif classiques
  {
    family: 'Playfair Display',
    category: 'serif',
    variants: ['400', '500', '600', '700', '800', '900', '400italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    version: 'v30',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDTbtXK-F2qO0isEw.woff2'
    }
  },
  {
    family: 'Merriweather',
    category: 'serif',
    variants: ['300', '400', '700', '900', '300italic', '400italic', '700italic', '900italic'],
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'],
    version: 'v30',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l521wRpX837pvjxPA.woff2'
    }
  },

  // Display pour titres
  {
    family: 'Oswald',
    category: 'sans-serif',
    variants: ['200', '300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'],
    version: 'v49',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.woff2'
    }
  },
  {
    family: 'Montserrat',
    category: 'sans-serif',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '100italic', '200italic', '300italic', '400italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'],
    version: 'v25',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.woff2'
    }
  },

  // Handwriting / Script
  {
    family: 'Dancing Script',
    category: 'handwriting',
    variants: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext', 'vietnamese'],
    version: 'v25',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup8.woff2'
    }
  },
  {
    family: 'Great Vibes',
    category: 'handwriting',
    variants: ['400'],
    subsets: ['latin', 'latin-ext'],
    version: 'v18',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/greatvibes/v18/RWmMoKWR9v4ksMfaWd_JN-XCg6UKDXlq.woff2'
    }
  },

  // Monospace
  {
    family: 'Fira Code',
    category: 'monospace',
    variants: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext'],
    version: 'v21',
    lastModified: '2023-03-09',
    files: {
      '400': 'https://fonts.gstatic.com/s/firacode/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7MOzlojwUKaJO.woff2'
    }
  }

  // TODO: Ajouter 10+ polices supplémentaires pour atteindre 20+ familles
];

export interface FontManager {
  loadedFonts: Set<string>;
  loadFont: (font: GoogleFont, variants?: string[]) => Promise<void>;
  isFontLoaded: (family: string) => boolean;
  getFontPreview: (family: string, text?: string) => string;
  searchFonts: (query: string, category?: string) => GoogleFont[];
  getPopularFonts: (count?: number) => GoogleFont[];
}

export interface TextPathOptions {
  enabled: boolean;
  path: string; // SVG path
  startOffset: number; // 0-100%
  method: 'align' | 'stretch';
  spacing: 'auto' | number;
  side: 'left' | 'right';
}

export interface AdvancedTextOptions {
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  textDecoration: 'none' | 'underline' | 'overline' | 'line-through';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  writingMode: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
  textShadow?: {
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  outline?: {
    color: string;
    width: number;
  };
}