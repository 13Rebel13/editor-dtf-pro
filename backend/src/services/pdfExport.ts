import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { ExportData, ExportConfig, PLATE_DIMENSIONS_MM } from '@dtf-editor/shared'
import { createApiError } from '../middleware/errorHandler'
import { downloadFromR2, uploadToR2 } from './cloudflareR2'
import { logger } from '../utils/logger'

const TEMP_DIR = path.join(process.cwd(), 'temp')
const PDF_TIMEOUT = parseInt(process.env.PDF_EXPORT_TIMEOUT || '300000') // 5 minutes

/**
 * Génère des fichiers PDF à partir des données d'export
 */
export async function generatePDF(exportData: ExportData, config: ExportConfig): Promise<string[]> {
  // Créer le dossier temporaire s'il n'existe pas
  await ensureTempDir()

  const pdfUrls: string[] = []

  try {
    for (let i = 0; i < exportData.plates.length; i++) {
      const plate = exportData.plates[i]
      const plateNumber = i + 1

      logger.debug(`Génération PDF planche ${plateNumber}/${exportData.plates.length}`)

      // Créer le SVG pour cette planche
      const svgContent = await createSVGForPlate(plate, exportData.files, exportData.textElements, config)
      
      // Écrire le SVG temporaire
      const svgPath = path.join(TEMP_DIR, `plate-${uuidv4()}.svg`)
      await fs.writeFile(svgPath, svgContent, 'utf-8')

      // Convertir SVG en PDF avec Inkscape
      const pdfPath = path.join(TEMP_DIR, `plate-${plateNumber}-${uuidv4()}.pdf`)
      await convertSVGToPDF(svgPath, pdfPath, config)

      // Upload du PDF vers R2
      const pdfBuffer = await fs.readFile(pdfPath)
      const pdfFileName = `export-${Date.now()}-plate-${plateNumber}.pdf`
      const pdfUrl = await uploadToR2(pdfBuffer, pdfFileName, 'application/pdf')
      
      pdfUrls.push(pdfUrl)

      // Nettoyer les fichiers temporaires
      await fs.unlink(svgPath).catch(() => {})
      await fs.unlink(pdfPath).catch(() => {})

      logger.debug(`PDF planche ${plateNumber} généré: ${pdfFileName}`)
    }

    return pdfUrls

  } catch (error) {
    logger.error('Erreur génération PDF:', error)
    throw createApiError(
      'Erreur lors de la génération des PDF',
      500,
      'PDF_GENERATION_ERROR'
    )
  }
}

/**
 * Crée le contenu SVG pour une planche
 */
async function createSVGForPlate(
  plate: any,
  files: any[],
  textElements: any[],
  config: ExportConfig
): Promise<string> {
  const plateDimensions = PLATE_DIMENSIONS_MM[plate.format]
  const bleedSize = config.includeBleed ? config.bleedSize : 0
  
  // Dimensions avec fond perdu
  const totalWidth = plateDimensions.width + (bleedSize * 2)
  const totalHeight = plateDimensions.height + (bleedSize * 2)

  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${totalWidth}mm" 
     height="${totalHeight}mm" 
     viewBox="0 0 ${totalWidth} ${totalHeight}">
  
  <!-- Fond blanc -->
  <rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" fill="white"/>
  
  <!-- Zone de planche -->
  <g transform="translate(${bleedSize}, ${bleedSize})">
`

  // Ajouter les éléments images
  for (const element of plate.elements) {
    const file = files.find(f => f.id === element.fileId)
    if (!file) continue

    try {
      // Convertir les coordonnées pixels en mm
      const xMm = element.position.x * 0.26458333333
      const yMm = element.position.y * 0.26458333333
      const widthMm = element.dimensions.width * 0.26458333333
      const heightMm = element.dimensions.height * 0.26458333333

      if (file.fileType === 'svg') {
        // Inclure le SVG directement
        const svgBuffer = await downloadFromR2(file.fileName)
        const svgString = svgBuffer.toString('utf-8')
        
        // Extraire le contenu du SVG (sans les balises svg racine)
        const contentMatch = svgString.match(/<svg[^>]*>(.*)<\/svg>/s)
        const content = contentMatch ? contentMatch[1] : svgString

        svgContent += `
  <g transform="translate(${xMm}, ${yMm}) scale(${widthMm/file.dimensionsMm.width}, ${heightMm/file.dimensionsMm.height}) rotate(${element.rotation})">
    ${content}
  </g>`
      } else {
        // Image raster ou autre format
        svgContent += `
  <image x="${xMm}" y="${yMm}" 
         width="${widthMm}" height="${heightMm}"
         transform="rotate(${element.rotation} ${xMm + widthMm/2} ${yMm + heightMm/2})"
         href="${file.url}" 
         preserveAspectRatio="none"/>`
      }
    } catch (error) {
      logger.warn(`Erreur inclusion fichier ${file.fileName}:`, error)
    }
  }

  // Ajouter les éléments de texte
  const plateTextElements = textElements.filter(t => t.plateId === plate.id)
  for (const textElement of plateTextElements) {
    const xMm = textElement.position.x * 0.26458333333
    const yMm = textElement.position.y * 0.26458333333
    const fontSizeMm = textElement.fontSize * 0.26458333333

    svgContent += `
  <text x="${xMm}" y="${yMm}" 
        font-family="${textElement.fontFamily}" 
        font-size="${fontSizeMm}mm"
        fill="${textElement.color}"
        transform="rotate(${textElement.rotation} ${xMm} ${yMm})">
    ${escapeXML(textElement.content)}
  </text>`
  }

  svgContent += `
  </g>
</svg>`

  return svgContent
}

/**
 * Convertit un SVG en PDF avec Inkscape
 */
async function convertSVGToPDF(svgPath: string, pdfPath: string, config: ExportConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      svgPath,
      '--export-type=pdf',
      `--export-filename=${pdfPath}`,
      '--export-area-page',
      '--export-dpi=300'
    ]

    // Options de qualité
    if (config.quality === 'high') {
      args.push('--export-pdf-version=1.4')
    }

    const inkscape = spawn('inkscape', args, {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    inkscape.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    inkscape.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    // Timeout
    const timeout = setTimeout(() => {
      inkscape.kill('SIGKILL')
      reject(new Error('Timeout lors de la conversion PDF'))
    }, PDF_TIMEOUT)

    inkscape.on('close', (code) => {
      clearTimeout(timeout)
      
      if (code === 0) {
        logger.debug('Conversion PDF réussie')
        resolve()
      } else {
        logger.error('Erreur Inkscape:', stderr)
        reject(new Error(`Inkscape a échoué avec le code ${code}: ${stderr}`))
      }
    })

    inkscape.on('error', (error) => {
      clearTimeout(timeout)
      reject(new Error(`Erreur lancement Inkscape: ${error.message}`))
    })
  })
}

/**
 * Assure que le dossier temporaire existe
 */
async function ensureTempDir(): Promise<void> {
  try {
    await fs.access(TEMP_DIR)
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true })
    logger.debug(`Dossier temporaire créé: ${TEMP_DIR}`)
  }
}

/**
 * Échappe les caractères XML
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}