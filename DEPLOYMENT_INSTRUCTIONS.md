# Instructions de déploiement et d'utilisation de DTF Editor

## Problèmes résolus

1. **Erreur TypeScript `dimensionsMm`** : Corrigé dans `backend/src/routes/files.ts`
2. **Erreur de build (dossier public)** : Le script de build crée maintenant correctement le dossier `dist/public`
3. **Erreur `this.undo is not a function`** : Corrigé en utilisant `undoLastAction()` au lieu de `undo()`
4. **Erreur CORS** : Voir les instructions ci-dessous

## Comment utiliser l'application correctement

### ⚠️ IMPORTANT : Ne pas ouvrir le fichier HTML directement

**NE PAS** faire ceci :
- Double-cliquer sur `dtf-editor.html`
- Ouvrir `file:///C:/path/to/dtf-editor.html` dans le navigateur

Cela cause l'erreur CORS car les navigateurs bloquent les requêtes depuis `file://` vers des API HTTP.

### ✅ Utilisation correcte

#### Option 1 : En développement local

1. Démarrer le serveur backend :
```bash
cd backend
yarn install
yarn dev
```

2. Accéder à l'application via : **http://localhost:5000**

#### Option 2 : En production (Render.com)

Accéder directement à : **https://editor-dtf-pro.onrender.com**

## Déploiement sur Render

### Étapes de déploiement

1. **Commit et push** les changements :
```bash
git add .
git commit -m "Fix: dimensionsMm error, build script, undo function, and CORS issues"
git push origin main
```

2. **Render déploiera automatiquement** avec les corrections suivantes :
   - Le fichier TypeScript compile maintenant correctement
   - Le dossier `public` est copié dans `dist/`
   - L'application sert `dtf-editor.html` au lieu de `index.html`

### Structure des fichiers après build

```
backend/
├── src/
│   └── public/
│       ├── index.html (ancien fichier)
│       └── dtf-editor.html (fichier principal)
└── dist/
    └── public/
        ├── index.html
        └── dtf-editor.html
```

## Variables d'environnement requises

Assurez-vous que ces variables sont configurées dans Render :

- `NODE_ENV=production`
- `PORT=10000`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ACCESS_KEY_ID`
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `CLOUDFLARE_BUCKET_NAME`
- `CLOUDFLARE_PUBLIC_URL`

## Test de l'API

Pour vérifier que le backend fonctionne :

```bash
# Health check
curl https://editor-dtf-pro.onrender.com/health

# Upload de fichiers (remplacer avec un vrai fichier)
curl -X POST https://editor-dtf-pro.onrender.com/api/files/upload-raw \
  -F "files=@image.png"
```

## Résolution de problèmes

### Si l'upload ne fonctionne toujours pas :

1. Vérifier la console du navigateur pour d'autres erreurs
2. Vérifier les logs sur Render Dashboard
3. S'assurer que toutes les variables d'environnement sont configurées
4. Vérifier que Cloudflare R2 est correctement configuré

### Si le fichier HTML ne se charge pas :

1. Vérifier que vous accédez bien via HTTP(S) et non file://
2. Vider le cache du navigateur
3. Vérifier les logs du serveur pour des erreurs 404/500