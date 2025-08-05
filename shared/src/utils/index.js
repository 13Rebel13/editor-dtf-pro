"use strict";
/**
 * Utilitaires partagés pour l'éditeur de planches DTF
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.generateRandomFileName = generateRandomFileName;
exports.mmToPixels = mmToPixels;
exports.pixelsToMm = pixelsToMm;
exports.applyScale = applyScale;
exports.removeScale = removeScale;
exports.dimensionsMmToPixels = dimensionsMmToPixels;
exports.dimensionsPixelsToMm = dimensionsPixelsToMm;
exports.calculateAreaMm = calculateAreaMm;
exports.getPlateAreaMm = getPlateAreaMm;
exports.resizeWithRatio = resizeWithRatio;
exports.isElementOutOfBounds = isElementOutOfBounds;
exports.calculatePlateEfficiency = calculatePlateEfficiency;
exports.formatFileSize = formatFileSize;
exports.validateDimensions = validateDimensions;
exports.clamp = clamp;
exports.roundTo = roundTo;
exports.doRectanglesOverlap = doRectanglesOverlap;
exports.findFreePosition = findFreePosition;
exports.normalizeRotation = normalizeRotation;
exports.snapRotation = snapRotation;
exports.debounce = debounce;
exports.throttle = throttle;
const types_1 = require("../types");
/**
 * Génère un ID unique
 */
function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
/**
 * Génère un nom de fichier aléatoire avec extension
 */
function generateRandomFileName(originalName) {
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    const randomName = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `${randomName}_${timestamp}.${extension}`;
}
/**
 * Convertit des millimètres en pixels
 */
function mmToPixels(mm) {
    return mm * types_1.CONSTANTS.MM_TO_PX;
}
/**
 * Convertit des pixels en millimètres
 */
function pixelsToMm(pixels) {
    return pixels * types_1.CONSTANTS.PX_TO_MM;
}
/**
 * Applique le facteur d'échelle pour l'affichage
 */
function applyScale(value) {
    return value * types_1.CONSTANTS.SCALE_FACTOR;
}
/**
 * Retire le facteur d'échelle
 */
function removeScale(value) {
    return value / types_1.CONSTANTS.SCALE_FACTOR;
}
/**
 * Calcule les dimensions en pixels à partir des dimensions en mm
 */
function dimensionsMmToPixels(dimensionsMm) {
    return {
        width: mmToPixels(dimensionsMm.width),
        height: mmToPixels(dimensionsMm.height)
    };
}
/**
 * Calcule les dimensions en mm à partir des dimensions en pixels
 */
function dimensionsPixelsToMm(dimensionsPixels) {
    return {
        width: pixelsToMm(dimensionsPixels.width),
        height: pixelsToMm(dimensionsPixels.height)
    };
}
/**
 * Calcule la surface d'un élément en mm²
 */
function calculateAreaMm(dimensions) {
    const dimensionsMm = dimensionsPixelsToMm(dimensions);
    return dimensionsMm.width * dimensionsMm.height;
}
/**
 * Calcule la surface totale d'une planche en mm²
 */
function getPlateAreaMm(format) {
    const dimensions = types_1.PLATE_DIMENSIONS_MM[format];
    return dimensions.width * dimensions.height;
}
/**
 * Redimensionne des dimensions en conservant le ratio
 */
function resizeWithRatio(currentDimensions, targetWidth, targetHeight) {
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
        }
        else {
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
function isElementOutOfBounds(position, dimensions, plateFormat) {
    const plateDimensions = types_1.PLATE_DIMENSIONS_MM[plateFormat];
    const plateDimensionsPixels = dimensionsMmToPixels(plateDimensions);
    return (position.x < 0 ||
        position.y < 0 ||
        position.x + dimensions.width > plateDimensionsPixels.width ||
        position.y + dimensions.height > plateDimensionsPixels.height);
}
/**
 * Calcule l'efficacité d'utilisation d'une planche
 */
function calculatePlateEfficiency(usedArea, plateFormat) {
    const totalArea = getPlateAreaMm(plateFormat);
    return Math.round((usedArea / totalArea) * 100);
}
/**
 * Formate une taille de fichier en format lisible
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Valide les dimensions d'un élément
 */
function validateDimensions(dimensions) {
    const dimensionsMm = dimensionsPixelsToMm(dimensions);
    return (dimensionsMm.width >= types_1.CONSTANTS.MIN_ELEMENT_SIZE &&
        dimensionsMm.width <= types_1.CONSTANTS.MAX_ELEMENT_SIZE &&
        dimensionsMm.height >= types_1.CONSTANTS.MIN_ELEMENT_SIZE &&
        dimensionsMm.height <= types_1.CONSTANTS.MAX_ELEMENT_SIZE);
}
/**
 * Clamp une valeur entre min et max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Arrondit un nombre à n décimales
 */
function roundTo(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}
/**
 * Vérifie si deux rectangles se chevauchent
 */
function doRectanglesOverlap(rect1, rect2, margin = 0) {
    return !(rect1.x + rect1.width + margin <= rect2.x ||
        rect2.x + rect2.width + margin <= rect1.x ||
        rect1.y + rect1.height + margin <= rect2.y ||
        rect2.y + rect2.height + margin <= rect1.y);
}
/**
 * Trouve une position libre pour un élément sur une planche
 */
function findFreePosition(dimensions, existingElements, plateFormat, margin = mmToPixels(types_1.CONSTANTS.DEFAULT_SPACING)) {
    const plateDimensions = types_1.PLATE_DIMENSIONS_MM[plateFormat];
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
            const hasOverlap = existingElements.some(element => doRectanglesOverlap(newRect, element, margin));
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
function normalizeRotation(rotation) {
    return ((rotation % 360) + 360) % 360;
}
/**
 * Arrondit une rotation au pas le plus proche
 */
function snapRotation(rotation, step) {
    return Math.round(rotation / step) * step;
}
/**
 * Débounce une fonction
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Throttle une fonction
 */
function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
//# sourceMappingURL=index.js.map