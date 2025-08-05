#!/bin/bash

# Script de build pour simuler le déploiement Render
set -e

echo "🏗️  Début du build pour Render..."

# Build du frontend
echo "📦 Build du frontend..."
cd frontend && yarn install --frozen-lockfile && yarn build

# Build du backend  
echo "🔧 Build du backend..."
cd ../backend && yarn install --frozen-lockfile && yarn build

# Copier les fichiers du frontend dans le backend
echo "📁 Copie des fichiers statiques..."
mkdir -p dist/public
cp -r ../frontend/dist/* dist/public/

echo "✅ Build terminé avec succès!"
echo "🚀 Prêt pour le déploiement sur Render"

# Informations sur les fichiers générés
echo ""
echo "📊 Taille des fichiers:"
du -sh dist/
du -sh dist/public/

echo ""
echo "📂 Contenu du répertoire public:"
ls -la dist/public/