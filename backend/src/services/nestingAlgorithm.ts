import { 
  NestingConfig, 
  NestingResult, 
  UploadedFile, 
  Plate, 
  PlateElement,
  PlateFormat,
  BackgroundType,
  PLATE_DIMENSIONS_MM,
  generateId,
  mmToPixels,
  findFreePosition,
  doRectanglesOverlap,
  getPlateAreaMm,
  calculateAreaMm
} from '@dtf-editor/shared'
import { createApiError } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

interface PlacementItem {
  file: UploadedFile
  quantity: number
  placed: number
  width: number    // en pixels
  height: number   // en pixels
  area: number     // en mm²
}

interface PlacementCandidate {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  file: UploadedFile
}

/**
 * Optimise automatiquement le placement des fichiers sur les planches
 */
export async function optimizePlacement(
  files: UploadedFile[],
  config: NestingConfig
): Promise<NestingResult> {
  try {
    logger.debug(`Début optimisation: ${files.length} fichiers, format ${config.plateFormat}`)

    // Préparer les éléments à placer
    const items = prepareItems(files, config)
    
    // Trier par surface décroissante (stratégie "First Fit Decreasing")
    items.sort((a, b) => b.area - a.area)

    // Générer les planches
    const plates = await generateOptimizedPlates(items, config)

    // Calculer l'efficacité
    const totalUsedArea = calculateTotalUsedArea(plates)
    const totalPlateArea = plates.length * getPlateAreaMm(config.plateFormat)
    const efficiency = Math.round((totalUsedArea / totalPlateArea) * 100)

    const result: NestingResult = {
      plates,
      efficiency,
      totalArea: totalUsedArea,
      unusedArea: totalPlateArea - totalUsedArea
    }

    logger.debug(`Optimisation terminée: ${plates.length} planches, ${efficiency}% d'efficacité`)

    return result

  } catch (error) {
    logger.error('Erreur algorithme nesting:', error)
    throw createApiError(
      'Erreur lors de l\'optimisation automatique',
      500,
      'NESTING_ALGORITHM_ERROR'
    )
  }
}

/**
 * Prépare les éléments pour le placement
 */
function prepareItems(files: UploadedFile[], config: NestingConfig): PlacementItem[] {
  return files.map(file => ({
    file,
    quantity: 1, // TODO: Permettre de spécifier la quantité
    placed: 0,
    width: mmToPixels(file.dimensionsMm.width),
    height: mmToPixels(file.dimensionsMm.height),
    area: calculateAreaMm(file.dimensions)
  }))
}

/**
 * Génère les planches optimisées
 */
async function generateOptimizedPlates(
  items: PlacementItem[],
  config: NestingConfig
): Promise<Plate[]> {
  const plates: Plate[] = []
  const plateDimensions = PLATE_DIMENSIONS_MM[config.plateFormat]
  const plateWidthPx = mmToPixels(plateDimensions.width)
  const plateHeightPx = mmToPixels(plateDimensions.height)
  const marginPx = mmToPixels(config.minSpacing)

  // Tant qu'il reste des éléments à placer
  while (items.some(item => item.placed < item.quantity)) {
    const plate = createNewPlate(config.plateFormat)
    const placedElements: Array<{ x: number; y: number; width: number; height: number }> = []

    // Essayer de placer chaque élément sur cette planche
    for (const item of items) {
      while (item.placed < item.quantity) {
        const candidates = generatePlacementCandidates(
          item,
          plateWidthPx,
          plateHeightPx,
          placedElements,
          marginPx,
          config
        )

        if (candidates.length === 0) {
          // Aucun placement possible pour cet élément
          break
        }

        // Choisir le meilleur candidat (Bottom-Left strategy)
        const bestCandidate = selectBestCandidate(candidates)

        // Placer l'élément
        const element = createPlateElement(bestCandidate, plate.id)
        plate.elements.push(element)

        // Ajouter aux éléments placés
        placedElements.push({
          x: bestCandidate.x,
          y: bestCandidate.y,
          width: bestCandidate.width,
          height: bestCandidate.height
        })

        item.placed++
      }
    }

    plates.push(plate)

    // Vérifier le nombre maximum de planches
    if (config.maxPlates && plates.length >= config.maxPlates) {
      logger.warn(`Limite de planches atteinte: ${config.maxPlates}`)
      break
    }
  }

  return plates
}

/**
 * Génère les candidats de placement pour un élément
 */
function generatePlacementCandidates(
  item: PlacementItem,
  plateWidth: number,
  plateHeight: number,
  placedElements: Array<{ x: number; y: number; width: number; height: number }>,
  margin: number,
  config: NestingConfig
): PlacementCandidate[] {
  const candidates: PlacementCandidate[] = []

  // Rotations possibles
  const rotations = config.allowRotation ? [0, 90, 180, 270] : [0]
  
  if (config.allowRotation && config.rotationStep && config.rotationStep < 90) {
    // Rotations personnalisées
    rotations.length = 0
    for (let angle = 0; angle < 360; angle += config.rotationStep) {
      rotations.push(angle)
    }
  }

  for (const rotation of rotations) {
    // Dimensions après rotation
    const isRotated = rotation === 90 || rotation === 270
    const width = isRotated ? item.height : item.width
    const height = isRotated ? item.width : item.height

    // Vérifier si l'élément peut tenir sur la planche
    if (width > plateWidth || height > plateHeight) {
      continue
    }

    // Générer les positions possibles
    const positions = generatePositions(
      width,
      height,
      plateWidth,
      plateHeight,
      placedElements,
      margin
    )

    for (const position of positions) {
      candidates.push({
        x: position.x,
        y: position.y,
        width,
        height,
        rotation,
        file: item.file
      })
    }
  }

  return candidates
}

/**
 * Génère les positions possibles pour un élément
 */
function generatePositions(
  elementWidth: number,
  elementHeight: number,
  plateWidth: number,
  plateHeight: number,
  placedElements: Array<{ x: number; y: number; width: number; height: number }>,
  margin: number
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = []

  // Stratégie Bottom-Left: essayer les positions en bas à gauche en premier
  const step = Math.max(10, margin) // Pas de recherche

  for (let y = 0; y <= plateHeight - elementHeight; y += step) {
    for (let x = 0; x <= plateWidth - elementWidth; x += step) {
      const candidate = {
        x,
        y,
        width: elementWidth,
        height: elementHeight
      }

      // Vérifier les collisions
      const hasCollision = placedElements.some(element =>
        doRectanglesOverlap(candidate, element, margin)
      )

      if (!hasCollision) {
        positions.push({ x, y })
        
        // Optimisation: si on trouve une position valide, on peut souvent
        // ignorer les positions similaires sur la même ligne
        if (positions.length > 50) {
          return positions.slice(0, 10) // Limiter le nombre de candidats
        }
      }
    }
  }

  return positions
}

/**
 * Sélectionne le meilleur candidat de placement
 */
function selectBestCandidate(candidates: PlacementCandidate[]): PlacementCandidate {
  // Stratégie Bottom-Left: privilégier les positions en bas à gauche
  return candidates.reduce((best, current) => {
    // Prioriser la position la plus basse (y le plus petit)
    if (current.y < best.y) return current
    if (current.y > best.y) return best
    
    // À égalité de hauteur, prioriser la position la plus à gauche
    if (current.x < best.x) return current
    
    return best
  })
}

/**
 * Crée une nouvelle planche vide
 */
function createNewPlate(format: PlateFormat): Plate {
  return {
    id: generateId(),
    format,
    elements: [],
    textElements: [],
    backgroundType: BackgroundType.GRID_LIGHT,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

/**
 * Crée un élément de planche à partir d'un candidat
 */
function createPlateElement(candidate: PlacementCandidate, plateId: string): PlateElement {
  return {
    id: generateId(),
    fileId: candidate.file.id,
    position: {
      x: candidate.x,
      y: candidate.y
    },
    dimensions: {
      width: candidate.width,
      height: candidate.height
    },
    rotation: candidate.rotation,
    keepRatio: true,
    zIndex: 1,
    plateId
  }
}

/**
 * Calcule la surface totale utilisée
 */
function calculateTotalUsedArea(plates: Plate[]): number {
  let totalArea = 0

  for (const plate of plates) {
    for (const element of plate.elements) {
      totalArea += calculateAreaMm(element.dimensions)
    }
  }

  return totalArea
}

/**
 * Algorithme de nesting plus avancé (bin packing)
 * Utilise l'algorithme "Bottom-Left Fill" avec optimisations
 */
export async function advancedNesting(
  files: UploadedFile[],
  config: NestingConfig
): Promise<NestingResult> {
  // TODO: Implémenter un algorithme plus sophistiqué
  // - Algorithme génétique
  // - Simulated annealing
  // - Particle swarm optimization
  
  // Pour l'instant, utiliser l'algorithme simple
  return optimizePlacement(files, config)
}