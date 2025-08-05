#!/bin/bash

# Script de configuration initiale pour l'éditeur DTF

set -e

echo "🎨 Configuration de l'éditeur de planches DTF..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    echo "   https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm --version) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."

echo "   → Installation des dépendances racine..."
npm install

echo "   → Installation des dépendances partagées..."
cd shared && npm install && cd ..

echo "   → Installation des dépendances frontend..."
cd frontend && npm install && cd ..

echo "   → Installation des dépendances backend..."
cd backend && npm install && cd ..

# Build du workspace partagé
echo "🔨 Build du workspace partagé..."
cd shared && npm run build && cd ..

# Copier les fichiers d'environnement
echo "⚙️  Configuration des variables d'environnement..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "   → Fichier backend/.env créé à partir de l'exemple"
    echo "   ⚠️  Pensez à configurer vos variables Cloudflare R2 dans backend/.env"
else
    echo "   → Fichier backend/.env déjà présent"
fi

# Vérifier Docker (optionnel)
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) détecté"
    
    # Vérifier Inkscape dans Docker
    echo "📋 Test de l'image Docker..."
    if docker run --rm ubuntu:22.04 bash -c "apt-get update && apt-get install -y inkscape && inkscape --version" > /dev/null 2>&1; then
        echo "✅ Inkscape disponible dans Docker"
    else
        echo "⚠️  Problème avec Inkscape dans Docker"
    fi
else
    echo "⚠️  Docker non détecté (optionnel pour le développement)"
fi

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p backend/temp
mkdir -p backend/uploads

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Configurer les variables Cloudflare R2 dans backend/.env"
echo "   2. Lancer le développement avec: npm run dev"
echo "   3. Frontend: http://localhost:3000"
echo "   4. Backend API: http://localhost:3001"
echo ""
echo "📚 Documentation :"
echo "   - README.md pour plus d'informations"
echo "   - backend/.env.example pour les variables d'environnement"
echo ""