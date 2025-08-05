# 📚 Documentation API

Cette documentation décrit l'API REST de l'éditeur de planches DTF.

## 🌐 Base URL

- **Développement**: `http://localhost:3001/api`
- **Production**: `https://dtf-editor-backend.onrender.com/api`

## 🔐 Authentification

Actuellement, l'API ne nécessite pas d'authentification. Pour un déploiement en production, il est recommandé d'ajouter un système d'authentification.

## 📁 Endpoints - Fichiers

### POST `/files/upload`

Upload d'un ou plusieurs fichiers.

**Paramètres:**
- `files`: Array de fichiers (FormData)

**Réponse:**
```json
{
  "success": true,
  "files": [
    {
      "id": "uuid",
      "originalName": "design.svg",
      "fileName": "abc123_timestamp.svg",
      "url": "https://bucket.r2.dev/abc123_timestamp.svg",
      "fileType": "svg",
      "size": 1024,
      "dimensions": { "width": 300, "height": 200 },
      "dimensionsMm": { "width": 79, "height": 53 },
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "1 fichier(s) uploadé(s) avec succès"
}
```

**Erreurs:**
- `400`: Format non supporté, fichier trop volumineux
- `500`: Erreur upload R2

### DELETE `/files/:fileId`

Suppression d'un fichier.

**Paramètres:**
- `fileId`: ID du fichier
- Body: `{ "fileName": "abc123_timestamp.svg" }`

**Réponse:**
```json
{
  "success": true,
  "message": "Fichier supprimé avec succès"
}
```

### POST `/files/validate`

Validation d'un fichier avant upload.

**Paramètres:**
- `file`: Fichier unique (FormData)

**Réponse:**
```json
{
  "success": true,
  "valid": true,
  "metadata": {
    "fileType": "svg",
    "size": 1024,
    "dimensions": { "width": 300, "height": 200 },
    "dimensionsMm": { "width": 79, "height": 53 }
  }
}
```

## 📤 Endpoints - Export

### POST `/export/pdf`

Génération d'un PDF à partir des planches.

**Paramètres:**
```json
{
  "data": {
    "plates": [
      {
        "id": "plate-1",
        "format": "55x100",
        "elements": [
          {
            "id": "element-1",
            "fileId": "file-1",
            "position": { "x": 100, "y": 200 },
            "dimensions": { "width": 300, "height": 200 },
            "rotation": 0,
            "keepRatio": true,
            "zIndex": 1,
            "plateId": "plate-1"
          }
        ],
        "textElements": [],
        "backgroundType": "grid-light"
      }
    ],
    "files": [...],
    "textElements": [],
    "format": "55x100"
  },
  "config": {
    "quality": "high",
    "colorSpace": "rgb",
    "includeBleed": false,
    "bleedSize": 3
  }
}
```

**Réponse:**
```json
{
  "success": true,
  "pdfUrls": [
    "https://bucket.r2.dev/export-123456-plate-1.pdf"
  ],
  "message": "1 PDF(s) généré(s) avec succès"
}
```

**Erreurs:**
- `400`: Données d'export invalides
- `500`: Erreur génération PDF

### POST `/export/preview`

Génération d'un aperçu des planches.

**Paramètres:**
Identiques à `/export/pdf`

**Réponse:**
```json
{
  "success": true,
  "previewUrls": [],
  "message": "Fonctionnalité d'aperçu en cours de développement"
}
```

## 🧩 Endpoints - Optimisation

### POST `/nesting/optimize`

Optimisation automatique du placement des éléments.

**Paramètres:**
```json
{
  "files": [
    {
      "id": "file-1",
      "originalName": "design.svg",
      "fileName": "abc123.svg",
      "url": "https://bucket.r2.dev/abc123.svg",
      "fileType": "svg",
      "size": 1024,
      "dimensions": { "width": 300, "height": 200 },
      "dimensionsMm": { "width": 79, "height": 53 },
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "config": {
    "plateFormat": "55x100",
    "allowRotation": true,
    "rotationStep": 15,
    "minSpacing": 6,
    "maxPlates": 10
  }
}
```

**Réponse:**
```json
{
  "success": true,
  "result": {
    "plates": [...],
    "efficiency": 85,
    "totalArea": 12000,
    "unusedArea": 2000
  },
  "message": "Optimisation réussie: 2 planche(s) générée(s)"
}
```

### POST `/nesting/calculate-efficiency`

Calcul de l'efficacité d'un placement.

**Paramètres:**
```json
{
  "plates": [...],
  "files": [...]
}
```

**Réponse:**
```json
{
  "success": true,
  "efficiency": 75,
  "details": {
    "totalArea": 10000,
    "usedArea": 7500,
    "unusedArea": 2500
  }
}
```

## 🔧 Endpoints - Utilitaires

### GET `/ping`

Test de connectivité de l'API.

**Réponse:**
```json
{
  "message": "pong",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### GET `/health`

Vérification de l'état du serveur.

**Réponse:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

## 📝 Types de Données

### PlateFormat
```
"55x100" | "55x50" | "A3"
```

### FileType
```
"png" | "jpg" | "jpeg" | "webp" | "pdf" | "svg" | "eps" | "psd" | "ai"
```

### BackgroundType
```
"grid-light" | "grid-dark" | "dots"
```

### Position
```json
{
  "x": number,
  "y": number
}
```

### Dimensions
```json
{
  "width": number,
  "height": number
}
```

## ⚠️ Limites

### Taille des fichiers
- **Maximum**: 100MB par fichier
- **Total**: Pas de limite sur le nombre de fichiers

### Formats supportés
- **Images**: PNG, JPG, JPEG, WebP
- **Vectoriel**: SVG, EPS, AI
- **Documents**: PDF, PSD

### Rate Limiting
- **Fenêtre**: 15 minutes
- **Limite**: 100 requêtes par IP

## 🐛 Gestion d'Erreurs

Toutes les erreurs suivent le format standard :

```json
{
  "error": {
    "message": "Description de l'erreur",
    "code": "ERROR_CODE",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Codes d'erreur communs

| Code | Description |
|------|-------------|
| `FILE_TOO_LARGE` | Fichier trop volumineux |
| `UNSUPPORTED_FORMAT` | Format de fichier non supporté |
| `UPLOAD_FAILED` | Échec de l'upload |
| `INVALID_DIMENSIONS` | Dimensions invalides |
| `EXPORT_FAILED` | Échec de l'export PDF |
| `NESTING_FAILED` | Échec de l'optimisation |
| `ROUTE_NOT_FOUND` | Route non trouvée |

## 📊 Exemples d'utilisation

### Upload d'un fichier
```javascript
const formData = new FormData()
formData.append('files', file)

const response = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData
})

const result = await response.json()
```

### Export PDF
```javascript
const exportData = {
  data: {
    plates: [...],
    files: [...],
    textElements: []
  },
  config: {
    quality: 'high',
    colorSpace: 'rgb',
    includeBleed: false,
    bleedSize: 3
  }
}

const response = await fetch('/api/export/pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(exportData)
})

const result = await response.json()
```

### Optimisation automatique
```javascript
const optimizeData = {
  files: [...],
  config: {
    plateFormat: '55x100',
    allowRotation: true,
    rotationStep: 15,
    minSpacing: 6
  }
}

const response = await fetch('/api/nesting/optimize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(optimizeData)
})

const result = await response.json()
```