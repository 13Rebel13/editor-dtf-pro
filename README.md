# 🎨 Éditeur de Planches DTF

Un éditeur web professionnel pour la création de planches d'impression DTF (Direct To Film). Permet aux utilisateurs de disposer librement leurs fichiers sur des planches de différents formats et de générer des PDF vectoriels haute qualité.

## ✨ Statut du Projet

**🚀 PROJET COMPLET ET DÉPLOYABLE**

L'éditeur de planches DTF est maintenant **entièrement fonctionnel** avec toutes les fonctionnalités demandées :

- ✅ Architecture complète (frontend + backend)
- ✅ Upload multi-formats avec Cloudflare R2
- ✅ Éditeur interactif avec Konva.js
- ✅ Algorithme d'optimisation automatique (nesting)
- ✅ Export PDF vectoriel haute qualité avec Inkscape
- ✅ Configuration de déploiement Render
- ✅ Documentation complète

## 🎯 Fonctionnalités Principales

- **Upload multi-formats** : PNG, SVG, PDF, JPEG, WebP, EPS, PSD, AI
- **Éditeur interactif** : Déplacement, redimensionnement, rotation, duplication
- **Formats de planches** : 55×100cm, 55×50cm, A3
- **Optimisation automatique** : Algorithme de nesting intelligent
- **Export PDF vectoriel** : Préservation de la qualité originale
- **Ajout de texte** : Zones de texte vectorielles avec polices personnalisées
- **Interface responsive** : Support mobile, tablette et desktop

## 🏗️ Architecture Technique

### Frontend
- **Framework** : Vite + React + TypeScript
- **UI** : Tailwind CSS
- **Canvas** : Konva.js pour l'éditeur 2D
- **Upload** : Intégration Cloudflare R2
- **Déploiement** : Render (site statique)

### Backend
- **Runtime** : Node.js + Express + TypeScript
- **Containerisation** : Docker avec Inkscape
- **Stockage** : Cloudflare R2
- **Export PDF** : Inkscape pour la génération vectorielle
- **Déploiement** : Render (service web)

## 📁 Structure du Projet

```
dtf-editor/
├── frontend/                 # Application web React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── layout/       # Layout (Header, Sidebar)
│   │   │   ├── canvas/       # Éditeur Konva
│   │   │   ├── upload/       # Upload de fichiers
│   │   │   ├── files/        # Gestion des fichiers
│   │   │   ├── plates/       # Gestion des planches
│   │   │   └── panels/       # Panneau propriétés
│   │   ├── contexts/         # Contextes React
│   │   └── types/            # Types TypeScript
│   └── package.json
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── routes/           # Routes API
│   │   │   ├── files.ts      # Upload/gestion fichiers
│   │   │   ├── export.ts     # Export PDF
│   │   │   └── nesting.ts    # Optimisation
│   │   ├── services/         # Services métier
│   │   │   ├── cloudflareR2.ts    # Intégration R2
│   │   │   ├── pdfExport.ts       # Génération PDF
│   │   │   └── nestingAlgorithm.ts # Algorithme nesting
│   │   ├── utils/            # Utilitaires
│   │   └── middleware/       # Middlewares Express
│   ├── Dockerfile            # Configuration Docker
│   └── package.json
├── shared/                   # Types et utilitaires partagés
│   ├── src/
│   │   ├── types/            # Types TypeScript
│   │   └── utils/            # Utilitaires partagés
│   └── package.json
├── docs/                     # Documentation
│   ├── API.md               # Documentation API
│   └── DEPLOYMENT.md        # Guide de déploiement
├── scripts/
│   └── setup.sh            # Script de configuration
├── render.yaml              # Configuration déploiement
└── README.md
```

## 🚀 Installation et Développement

### Installation rapide

```bash
# 1. Cloner le repository
git clone <votre-repo>
cd dtf-editor

# 2. Exécuter le script de configuration
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Configurer Cloudflare R2 dans backend/.env
# Voir backend/.env.example pour les variables

# 4. Lancer le développement
npm run dev
```

### Installation manuelle

```bash
# 1. Installer les dépendances
npm install

# 2. Installer les dépendances de chaque workspace
npm run install:all

# 3. Build du workspace partagé
cd shared && npm run build && cd ..

# 4. Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos clés Cloudflare R2

# 5. Lancer le développement
npm run dev
```

## 🌐 URLs de Développement

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **Health Check** : http://localhost:3001/health
- **API Docs** : Voir `docs/API.md`

## 🔧 Configuration Cloudflare R2

1. **Créer un bucket R2** dans le dashboard Cloudflare
2. **Obtenir les clés d'accès** :
   - Account ID
   - Access Key ID 
   - Secret Access Key
3. **Configurer dans `backend/.env`** :
   ```env
   CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
   CLOUDFLARE_R2_BUCKET_NAME=dtf-editor-files
   CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.r2.dev
   ```

## 🌐 Déploiement

### Déploiement Render (Recommandé)

Le projet est entièrement configuré pour Render :

```bash
# 1. Pousser sur GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Importer dans Render avec render.yaml
# Le fichier render.yaml configure automatiquement :
# - Service backend (Docker + Inkscape)
# - Site frontend (statique)
# - Variables d'environnement

# 3. Configurer les variables secrètes Cloudflare R2
```

**Coût estimé** : ~30-40€/mois (Render + Cloudflare R2)

Voir `docs/DEPLOYMENT.md` pour le guide complet.

## 📚 Documentation

- **[Guide de Déploiement](docs/DEPLOYMENT.md)** - Déploiement sur Render
- **[Documentation API](docs/API.md)** - Endpoints et exemples
- **[Types Partagés](shared/src/types/index.ts)** - Types TypeScript
- **[Configuration Docker](backend/Dockerfile)** - Container avec Inkscape

## 🎨 Fonctionnalités Détaillées

### Upload de Fichiers
- **Formats supportés** : PNG, SVG, PDF, JPEG, WebP, EPS, PSD, AI
- **Taille max** : 100MB par fichier
- **Stockage** : Cloudflare R2 avec noms aléatoires
- **Métadonnées** : Extraction automatique des dimensions

### Éditeur Interactif
- **Canvas Konva.js** : Rendu 2D haute performance
- **Manipulation** : Déplacement, rotation, redimensionnement
- **Fonds** : Grille claire/sombre, points de repère
- **Zoom** : Contrôles de zoom et ajustement fenêtre

### Optimisation Automatique
- **Algorithme** : Bottom-Left Fill avec rotations
- **Configuration** : Espacement min 6mm, rotations personnalisées
- **Multi-planches** : Génération automatique si débordement
- **Efficacité** : Calcul en temps réel

### Export PDF Vectoriel
- **Inkscape** : Génération PDF haute qualité (300 DPI)
- **Préservation** : SVG et EPS restent vectoriels
- **Formats** : Support de tous les formats d'entrée
- **Fond perdu** : Option bleed configurable

## 🧪 Tests et Qualité

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build production
npm run build
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **Konva.js** - Canvas 2D haute performance
- **React Dropzone** - Upload drag & drop
- **React Hot Toast** - Notifications

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Multer** - Upload de fichiers
- **Sharp** - Traitement d'images
- **AWS SDK S3** - Client Cloudflare R2
- **Inkscape** - Génération PDF vectorielle

### DevOps
- **Docker** - Containerisation avec Inkscape
- **Render** - Déploiement cloud
- **Cloudflare R2** - Stockage objet

## 🤝 Contribution

Le projet suit une architecture modulaire et scalable :

1. **Types partagés** dans `shared/` pour la cohérence
2. **API REST** documentée dans `docs/API.md`
3. **Composants React** réutilisables
4. **Services backend** découplés
5. **Configuration Docker** prête pour la production

## 🎯 Prochaines Étapes

Le projet est **entièrement fonctionnel** et prêt pour la production. Améliorations possibles :

- [ ] **Interface mobile** optimisée (responsive déjà implémenté)
- [ ] **Système d'authentification** utilisateurs
- [ ] **Sauvegarde projets** en base de données
- [ ] **Historique undo/redo** avancé
- [ ] **Collaboration temps réel**
- [ ] **Algorithmes nesting** avancés (génétique, simulated annealing)

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**🎉 Le projet est maintenant complet et prêt à être déployé !**

Pour toute question ou personnalisation, l'architecture modulaire permet des modifications faciles et l'ajout de nouvelles fonctionnalités.