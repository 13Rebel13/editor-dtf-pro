# 🌐 Guide de Déploiement

Ce guide explique comment déployer l'éditeur de planches DTF sur Render.

## 📋 Prérequis

### 1. Compte Render
- Créer un compte sur [render.com](https://render.com)
- Connecter votre repository GitHub

### 2. Compte Cloudflare R2
- Créer un compte Cloudflare
- Configurer un bucket R2 pour le stockage des fichiers
- Obtenir les clés d'accès

## ⚙️ Configuration Cloudflare R2

### 1. Créer un bucket R2
```bash
# Depuis le dashboard Cloudflare
1. Aller dans R2 Object Storage
2. Créer un nouveau bucket (ex: dtf-editor-files)
3. Configurer les permissions publiques si nécessaire
```

### 2. Obtenir les clés d'accès
```bash
# Dans le dashboard Cloudflare
1. Aller dans "Manage R2 API tokens"
2. Créer un token avec permissions :
   - Object:Read
   - Object:Write
   - Object:Delete
3. Noter :
   - Account ID
   - Access Key ID
   - Secret Access Key
```

### 3. Configurer le domaine public (optionnel)
```bash
# Pour un accès direct aux fichiers
1. Aller dans "Custom domains" du bucket
2. Ajouter un domaine personnalisé
3. Configurer les DNS
```

## 🚀 Déploiement sur Render

### 1. Préparation du repository
```bash
# Pousser le code sur GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Configuration des services Render

#### A. Créer le service backend
1. Dans Render Dashboard → "New" → "Web Service"
2. Connecter le repository GitHub
3. Configurer :
   - **Name**: `dtf-editor-backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Region**: Frankfurt (ou plus proche)
   - **Plan**: Starter (ou supérieur)

#### B. Configurer les variables d'environnement backend
```env
NODE_ENV=production
PORT=3001
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=dtf-editor-files
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.r2.dev
MAX_FILE_SIZE=104857600
MAX_FILES_PER_PROJECT=50
PDF_EXPORT_TIMEOUT=300000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### C. Créer le service frontend
1. Dans Render Dashboard → "New" → "Static Site"
2. Connecter le même repository
3. Configurer :
   - **Name**: `dtf-editor-frontend`
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Auto-Deploy**: Yes

#### D. Configurer les variables d'environnement frontend
```env
VITE_API_URL=https://dtf-editor-backend.onrender.com
```

### 3. Configuration du fichier render.yaml

Le fichier `render.yaml` à la racine configure automatiquement les services :

```yaml
# Déjà configuré dans le projet
# Modifiez les valeurs si nécessaire
```

## 🔧 Configuration Avancée

### 1. Domaine personnalisé
```bash
# Pour chaque service Render
1. Aller dans Settings → Custom Domains
2. Ajouter votre domaine
3. Configurer les DNS CNAME
```

### 2. HTTPS et Sécurité
- Render configure automatiquement HTTPS
- Les headers de sécurité sont définis dans le code
- Rate limiting activé par défaut

### 3. Monitoring
```bash
# Logs disponibles dans Render Dashboard
1. Aller dans le service → Logs
2. Configurer des alertes si nécessaire
3. Monitoring des performances
```

## 🐛 Débogage

### 1. Vérifier les logs
```bash
# Dans Render Dashboard
1. Sélectionner le service
2. Onglet "Logs"
3. Filtrer par niveau d'erreur
```

### 2. Tester les endpoints
```bash
# Health check
curl https://dtf-editor-backend.onrender.com/health

# API test
curl https://dtf-editor-backend.onrender.com/api/ping
```

### 3. Problèmes courants

#### Backend ne démarre pas
- Vérifier les variables d'environnement Cloudflare
- Vérifier les logs Docker
- Vérifier la disponibilité d'Inkscape

#### Frontend ne charge pas
- Vérifier l'URL de l'API dans les variables d'environnement
- Vérifier les CORS
- Vérifier le build

#### Upload de fichiers échoue
- Vérifier les permissions Cloudflare R2
- Vérifier la configuration du bucket
- Vérifier la taille max des fichiers

## 📊 Performance

### 1. Optimisations recommandées
- Utiliser un plan Render supérieur pour plus de performances
- Configurer un CDN devant R2
- Optimiser les images avant upload

### 2. Monitoring
- Utiliser les métriques Render
- Configurer des alertes sur l'utilisation
- Surveiller l'espace de stockage R2

## 🔄 Mise à jour

### 1. Déploiement automatique
```bash
# Push sur main déclenche le déploiement
git push origin main
```

### 2. Rollback
```bash
# Dans Render Dashboard
1. Aller dans le service → Deploys
2. Sélectionner un déploiement précédent
3. Cliquer "Redeploy"
```

## 🛡️ Sécurité

### 1. Variables d'environnement
- Utiliser les "Environment Variables" de Render
- Ne jamais commiter les clés secrètes
- Rotation régulière des clés Cloudflare

### 2. CORS
- Configuré automatiquement entre frontend et backend
- Ajuster si domaines personnalisés

### 3. Rate Limiting
- Configuré par défaut
- Ajuster selon le trafic attendu

## 💰 Coûts

### Render
- **Starter Plan**: Gratuit (limité)
- **Professional Plan**: $25/mois par service

### Cloudflare R2
- **Stockage**: $0.015/GB/mois
- **Opérations**: $4.50/million de requêtes
- **Transfert**: Gratuit jusqu'à 10GB/mois

### Estimation mensuelle (usage modéré)
- Render Backend: $25
- Render Frontend: Gratuit
- Cloudflare R2: $5-15
- **Total**: ~$30-40/mois