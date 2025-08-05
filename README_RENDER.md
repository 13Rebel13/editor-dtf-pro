# Configuration Render pour DTF Editor

## 📋 Instructions de déploiement

### Configuration du Web Service Backend

#### Paramètres généraux
- **Repository** : Connecter votre repository GitHub
- **Root Directory** : `/` (IMPORTANT : NE PAS mettre `backend/`)
- **Environment** : `Node`
- **Region** : Choisir la région la plus proche

#### Scripts de build et démarrage
```
Build Command: yarn install && yarn workspace @dtf-editor/backend build
Start Command: yarn workspace @dtf-editor/backend start
```

#### Variables d'environnement requises
```
NODE_ENV=production
PORT=10000
```

#### Variables d'environnement optionnelles (selon votre configuration)
```
# Si vous utilisez AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Base de données (si applicable)
DATABASE_URL=your_database_url

# Autres configurations spécifiques à votre app
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🏗️ Architecture du projet

Ce projet utilise **Yarn Workspaces** avec la structure suivante :

```
dtf-editor/
├── package.json          # Configuration racine des workspaces
├── yarn.lock             # Lockfile Yarn
├── .yarnrc               # Configuration Yarn v1
├── backend/              # API Node.js/Express
├── frontend/             # Interface React/Vite
└── shared/               # Types et utilitaires partagés
```

## ✅ Points clés pour Render

### 1. Root Directory = `/`
⚠️ **CRITIQUE** : Le Root Directory doit être `/` et non `/backend/` car :
- Yarn Workspaces nécessite l'accès au `package.json` racine
- Les dépendances sont gérées depuis la racine
- Le `yarn.lock` est à la racine

### 2. Build Command expliquée
```bash
yarn install && yarn workspace @dtf-editor/backend build
```
- `yarn install` : Installe toutes les dépendances du monorepo
- `yarn workspace @dtf-editor/backend build` : Compile le backend TypeScript

### 3. Start Command expliquée
```bash
yarn workspace @dtf-editor/backend start
```
- Lance le serveur backend compilé depuis `backend/dist/index.js`

### 4. Port Configuration
- Render assigne automatiquement le port via `process.env.PORT`
- Le backend est configuré pour utiliser `process.env.PORT || 3001`

## 🔧 Dépannage

### Si le build échoue

1. **Vérifiez le Root Directory** : Doit être `/`
2. **Vérifiez les Build Commands** : Exactement comme indiqué ci-dessus
3. **Variables d'environnement** : `NODE_ENV=production` est recommandé

### Si le démarrage échoue

1. **Vérifiez les logs Render** pour les erreurs spécifiques
2. **Port** : Assurez-vous que le backend écoute sur `process.env.PORT`
3. **Dépendances** : Toutes les dépendances doivent être dans `dependencies` (pas `devDependencies`)

### Erreurs TypeScript pendant le build

Le projet est configuré pour compiler malgré certaines erreurs TypeScript non critiques. Si le build échoue :

1. Les erreurs de types Express sont connues et n'empêchent pas l'exécution
2. Le script de build utilise `--noEmitOnError false` pour forcer la compilation
3. Le JavaScript généré fonctionne correctement

## 📦 Structure des Workspaces

- **@dtf-editor/shared** : Types TypeScript partagés
- **@dtf-editor/backend** : API Express.js
- **@dtf-editor/frontend** : Interface utilisateur React

## 🚀 Commandes locales pour tester

```bash
# Installation
yarn install

# Build complet
yarn build

# Démarrage backend seul
yarn workspace @dtf-editor/backend start

# Développement
yarn dev
```

## 📝 Notes importantes

- Le projet utilise Yarn v1 (compatible Render)
- Les workspaces utilisent des références `file:../` au lieu de `workspace:*`
- Tous les modules sont hoisted à la racine pour éviter les conflits
- Le build TypeScript peut afficher des warnings mais fonctionne correctement