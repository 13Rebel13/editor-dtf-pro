# 🎨 Graphite DTF Fusion

**Éditeur vectoriel professionnel pour l'impression DTF (Direct To Film)**

Un éditeur vectoriel moderne combinant les fonctionnalités avancées de Graphite avec des spécificités DTF pour une expérience d'impression optimale.

## 🚀 Fonctionnalités

### 📐 Formats de Planches DTF
- **55x100cm** - Format principal professionnel
- **55x50cm** - Demi-format optimisé
- **A3** - Format test et prototype
- Grille et guides d'alignement précis

### 🎨 Arrière-plans Variés
- Couleurs unies avec picker avancé
- Dégradés (linéaires, radiaux, coniques)
- Motifs et patterns professionnels
- Textures réalistes (bois, métal, tissu)
- Import d'images personnalisées

### 🖼️ Gestion d'Images Avancée
- Import par drag & drop intuitif
- Redimensionnement interactif avec ratio
- Rotation libre et positionnement précis
- Système de calques professionnel

### ✍️ Outils Texte Vectoriels
- 20+ familles Google Fonts
- Styles complets (normal, gras, italique)
- Texte sur chemin et courbes
- Export vectoriel préservé

### 🔍 Analyseur DTF Spécialisé
- Détection traits < 0.5mm
- Détection espaces < 1mm
- Rapport d'analyse détaillé
- Highlighting visuel des problèmes

### 📄 Import PDF Professionnel
- Conversion vectorielle → SVG
- Préservation des images raster
- Extraction de texte éditable
- Validation et gestion d'erreurs

## 🛠️ Stack Technique

- **Frontend**: React 18 + TypeScript + Vite
- **Canvas**: Konva.js pour le rendu vectoriel
- **État**: Zustand pour la gestion d'état
- **UI**: Tailwind CSS + Lucide Icons
- **Structure**: Monorepo avec workspaces

## 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🚀 Installation Rapide

### Windows (PowerShell)
```powershell
# Télécharger et exécuter le script d'installation
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-repo/graphite-dtf-fusion/main/install.ps1" -OutFile "install.ps1"
.\install.ps1
```

### Installation Manuelle
```bash
# Cloner le projet
git clone https://github.com/your-repo/graphite-dtf-fusion.git
cd graphite-dtf-fusion

# Installer toutes les dépendances
npm run install:all

# Lancer en développement
npm run dev
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Aperçu de la build
npm run preview

# Vérification des types
npm run type-check

# Installation complète
npm run install:all
```

## 📐 Spécifications DTF

### Résolutions Supportées
- **Résolution**: 300 DPI minimum
- **Traits minimum**: 0.5mm (142 pixels à 300 DPI)
- **Espacement minimum**: 1mm entre éléments

### Formats Exacts
- **55x100cm**: 6496 x 11811 pixels à 300 DPI
- **55x50cm**: 6496 x 5906 pixels à 300 DPI  
- **A3**: 3508 x 4961 pixels à 300 DPI

## 📦 Export Professionnel

- **SVG**: Vectoriel haute qualité
- **PNG**: 300 DPI pour impression
- **PDF**: Print-ready avec métadonnées DTF

## 🎯 Workflow Guidé

1. **Choix du format** de planche DTF
2. **Sélection** de l'arrière-plan
3. **Import et placement** des éléments
4. **Analyse qualité** DTF automatique
5. **Export final** optimisé

## 🌟 Caractéristiques

- ✅ 100% self-hostable
- ✅ Compatible tous navigateurs modernes
- ✅ Performance optimisée (Canvas > 10MB)
- ✅ Interface responsive
- ✅ Thème sombre/clair
- ✅ Raccourcis clavier
- ✅ Système Undo/Redo

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le guide de contribution pour plus d'informations.

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/your-repo/graphite-dtf-fusion/issues)
- Discussions: [GitHub Discussions](https://github.com/your-repo/graphite-dtf-fusion/discussions)

---

**Graphite DTF Fusion** - L'éditeur vectoriel nouvelle génération pour l'impression DTF professionnelle.