"use strict";
/**
 * Types partagés pour l'éditeur de planches DTF
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = exports.ErrorCode = exports.BackgroundType = exports.MIME_TYPES = exports.FileType = exports.PLATE_DIMENSIONS_MM = exports.PLATE_DIMENSIONS = exports.PlateFormat = void 0;
// Formats de planches supportés
var PlateFormat;
(function (PlateFormat) {
    PlateFormat["LARGE"] = "55x100";
    PlateFormat["MEDIUM"] = "55x50";
    PlateFormat["A3"] = "A3"; // A3
})(PlateFormat || (exports.PlateFormat = PlateFormat = {}));
// Dimensions des planches en pixels (échelle 1:2)
exports.PLATE_DIMENSIONS = {
    [PlateFormat.LARGE]: { width: 1654, height: 3937 },
    [PlateFormat.MEDIUM]: { width: 1654, height: 1968 },
    [PlateFormat.A3]: { width: 1240, height: 1754 }
};
// Dimensions réelles en millimètres
exports.PLATE_DIMENSIONS_MM = {
    [PlateFormat.LARGE]: { width: 550, height: 1000 },
    [PlateFormat.MEDIUM]: { width: 550, height: 500 },
    [PlateFormat.A3]: { width: 297, height: 420 }
};
// Types de fichiers supportés
var FileType;
(function (FileType) {
    FileType["PNG"] = "png";
    FileType["JPG"] = "jpg";
    FileType["JPEG"] = "jpeg";
    FileType["WEBP"] = "webp";
    FileType["PDF"] = "pdf";
    FileType["SVG"] = "svg";
    FileType["EPS"] = "eps";
    FileType["PSD"] = "psd";
    FileType["AI"] = "ai";
})(FileType || (exports.FileType = FileType = {}));
// MIME types correspondants
exports.MIME_TYPES = {
    [FileType.PNG]: 'image/png',
    [FileType.JPG]: 'image/jpeg',
    [FileType.JPEG]: 'image/jpeg',
    [FileType.WEBP]: 'image/webp',
    [FileType.PDF]: 'application/pdf',
    [FileType.SVG]: 'image/svg+xml',
    [FileType.EPS]: 'application/postscript',
    [FileType.PSD]: 'image/vnd.adobe.photoshop',
    [FileType.AI]: 'application/illustrator'
};
// Types de fond disponibles
var BackgroundType;
(function (BackgroundType) {
    BackgroundType["GRID_LIGHT"] = "grid-light";
    BackgroundType["GRID_DARK"] = "grid-dark";
    BackgroundType["DOTS"] = "dots";
})(BackgroundType || (exports.BackgroundType = BackgroundType = {}));
// Erreurs spécifiques
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["FILE_TOO_LARGE"] = "FILE_TOO_LARGE";
    ErrorCode["UNSUPPORTED_FORMAT"] = "UNSUPPORTED_FORMAT";
    ErrorCode["UPLOAD_FAILED"] = "UPLOAD_FAILED";
    ErrorCode["INVALID_DIMENSIONS"] = "INVALID_DIMENSIONS";
    ErrorCode["PLATE_OVERFLOW"] = "PLATE_OVERFLOW";
    ErrorCode["EXPORT_FAILED"] = "EXPORT_FAILED";
    ErrorCode["NESTING_FAILED"] = "NESTING_FAILED";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// Constantes utiles
exports.CONSTANTS = {
    MIN_ELEMENT_SIZE: 5, // Taille minimale d'un élément en mm
    MAX_ELEMENT_SIZE: 1000, // Taille maximale d'un élément en mm
    DEFAULT_SPACING: 6, // Espacement par défaut en mm
    SCALE_FACTOR: 0.5, // Facteur d'échelle pour l'affichage (1:2)
    DPI: 300, // DPI pour la conversion mm/pixels
    MM_TO_PX: 3.779527559, // Conversion mm vers pixels à 96 DPI
    PX_TO_MM: 0.26458333333 // Conversion pixels vers mm à 96 DPI
};
//# sourceMappingURL=index.js.map