# Utiliser une image Node.js basée sur Ubuntu pour avoir Inkscape
FROM ubuntu:22.04

# Éviter les prompts interactifs
ENV DEBIAN_FRONTEND=noninteractive

# Installer Node.js, npm et Inkscape
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    software-properties-common \
    inkscape \
    fonts-liberation \
    fonts-dejavu-core \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY ../shared/package*.json ../shared/

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .
COPY ../shared/ ../shared/

# Construire l'application
RUN npm run build

# Créer le dossier temporaire
RUN mkdir -p temp

# Créer un utilisateur non-root
RUN useradd -r -s /bin/false nodeuser \
    && chown -R nodeuser:nodeuser /app
USER nodeuser

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Vérifier qu'Inkscape est disponible
RUN inkscape --version

# Commande de démarrage
CMD ["node", "dist/index.js"]