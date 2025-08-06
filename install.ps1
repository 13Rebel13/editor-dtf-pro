# =============================================================================
# Script d'installation pour Graphite DTF Fusion
# Éditeur vectoriel professionnel pour l'impression DTF
# =============================================================================

param(
    [switch]$Development,
    [switch]$SkipDependencies,
    [string]$InstallPath = "$env:USERPROFILE\GraphiteDTFFusion"
)

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Couleurs pour l'affichage
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    $currentColor = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $Color
    Write-Output $Message
    $Host.UI.RawUI.ForegroundColor = $currentColor
}

function Write-Header {
    param([string]$Text)
    Write-Host "`n" -NoNewline
    Write-ColorOutput "===============================================" "Cyan"
    Write-ColorOutput " $Text" "Yellow"
    Write-ColorOutput "===============================================" "Cyan"
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✓ $Message" "Green"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "✗ $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ $Message" "Blue"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠ $Message" "Yellow"
}

# Banner d'accueil
Clear-Host
Write-ColorOutput @"
  ________                    __    _ __           ____  ________    ______           _             
 / ____/ /________ ___  ___  / /_  (_) /____     / __ \/_  __/ ____/ ____/_  _______(_)___  ____  
/ /   / __/ ___/ / / / / __ \/ __ \/ / __/ _ \   / / / / / / / /_  / /_  / / / / ___/ / __ \/ __ \ 
/ /___/ /_/ /  / /_/ / / /_/ / / / / / /_/  __/  / /_/ / / / / __/ / __/ / /_/ (__  ) / /_/ / / / /
\____/\__/_/   \__,_/_/ .___/_/ /_/_/\__/\___/  /_____/ /_/ /_/   /_/    \__,_/____/_/\____/_/ /_/ 
                     /_/                                                                           
"@ "Magenta"

Write-ColorOutput "🎨 Éditeur vectoriel professionnel pour l'impression DTF" "Cyan"
Write-ColorOutput "Version 1.0.0 - Installation automatisée pour Windows`n" "Gray"

# Vérification des prérequis
Write-Header "Vérification des prérequis système"

# Vérification de PowerShell
$psVersion = $PSVersionTable.PSVersion
Write-Info "PowerShell version: $($psVersion.Major).$($psVersion.Minor)"
if ($psVersion.Major -lt 5) {
    Write-Error "PowerShell 5.0 ou supérieur requis. Veuillez mettre à jour PowerShell."
    exit 1
}
Write-Success "PowerShell compatible"

# Vérification de l'exécution
$executionPolicy = Get-ExecutionPolicy
Write-Info "Politique d'exécution: $executionPolicy"
if ($executionPolicy -eq "Restricted") {
    Write-Warning "La politique d'exécution est restrictive."
    Write-Info "Tentative de modification temporaire..."
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Success "Politique d'exécution modifiée"
    }
    catch {
        Write-Error "Impossible de modifier la politique d'exécution. Veuillez exécuter en tant qu'administrateur."
        exit 1
    }
}

# Vérification de Node.js
Write-Info "Vérification de Node.js..."
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        $versionNumber = [version]($nodeVersion -replace "v", "")
        Write-Info "Node.js version: $nodeVersion"
        if ($versionNumber -lt [version]"18.0.0") {
            Write-Error "Node.js 18.0.0 ou supérieur requis. Version détectée: $nodeVersion"
            if (-not $SkipDependencies) {
                Write-Info "Téléchargement et installation de Node.js..."
                Start-Process "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
                Write-Warning "Veuillez installer Node.js et relancer ce script."
                exit 1
            }
        }
        Write-Success "Node.js compatible"
    }
    else {
        throw "Node.js non trouvé"
    }
}
catch {
    Write-Error "Node.js non installé ou non accessible"
    if (-not $SkipDependencies) {
        Write-Info "Ouverture de la page de téléchargement de Node.js..."
        Start-Process "https://nodejs.org/en/download/"
        Write-Warning "Veuillez installer Node.js et relancer ce script."
        exit 1
    }
}

# Vérification de npm
Write-Info "Vérification de npm..."
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Info "npm version: $npmVersion"
        Write-Success "npm disponible"
    }
    else {
        throw "npm non trouvé"
    }
}
catch {
    Write-Error "npm non disponible"
    exit 1
}

# Vérification de Git (optionnel)
Write-Info "Vérification de Git..."
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Info "Git version: $gitVersion"
        Write-Success "Git disponible"
    }
    else {
        Write-Warning "Git non installé (optionnel pour le développement)"
    }
}
catch {
    Write-Warning "Git non installé (optionnel pour le développement)"
}

# Création du répertoire d'installation
Write-Header "Préparation de l'installation"

Write-Info "Répertoire d'installation: $InstallPath"
if (Test-Path $InstallPath) {
    Write-Warning "Le répertoire existe déjà."
    $response = Read-Host "Voulez-vous le supprimer et réinstaller? (o/N)"
    if ($response -eq "o" -or $response -eq "O" -or $response -eq "oui") {
        Write-Info "Suppression du répertoire existant..."
        Remove-Item -Path $InstallPath -Recurse -Force
        Write-Success "Répertoire supprimé"
    }
    else {
        Write-Info "Installation annulée par l'utilisateur"
        exit 0
    }
}

Write-Info "Création du répertoire d'installation..."
New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
Write-Success "Répertoire créé"

# Téléchargement des sources
Write-Header "Téléchargement de Graphite DTF Fusion"

$repoUrl = "https://github.com/GraphiteDTFFusion/graphite-dtf-fusion.git"
$zipUrl = "https://github.com/GraphiteDTFFusion/graphite-dtf-fusion/archive/refs/heads/main.zip"
$zipPath = "$InstallPath\source.zip"

try {
    # Tentative avec Git d'abord
    Write-Info "Téléchargement via Git..."
    Set-Location $InstallPath
    git clone $repoUrl . 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Sources téléchargées avec Git"
    }
    else {
        throw "Échec du clone Git"
    }
}
catch {
    try {
        Write-Info "Téléchargement de l'archive ZIP..."
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
        
        Write-Info "Extraction de l'archive..."
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $InstallPath)
        
        # Déplacement des fichiers du sous-dossier
        $extractedFolder = Get-ChildItem $InstallPath -Directory | Where-Object { $_.Name -like "*graphite-dtf-fusion*" }
        if ($extractedFolder) {
            Get-ChildItem $extractedFolder.FullName | Move-Item -Destination $InstallPath
            Remove-Item $extractedFolder.FullName -Force
        }
        
        Remove-Item $zipPath -Force
        Write-Success "Sources téléchargées et extraites"
    }
    catch {
        Write-Error "Impossible de télécharger les sources: $($_.Exception.Message)"
        exit 1
    }
}

# Installation des dépendances
Write-Header "Installation des dépendances"

Set-Location $InstallPath

# Vérification de la structure du projet
if (-not (Test-Path "package.json")) {
    Write-Error "Structure de projet invalide. package.json non trouvé."
    exit 1
}

Write-Info "Installation des dépendances du projet principal..."
try {
    npm install --silent
    Write-Success "Dépendances principales installées"
}
catch {
    Write-Error "Échec de l'installation des dépendances principales: $($_.Exception.Message)"
    exit 1
}

Write-Info "Installation des dépendances des workspaces..."
try {
    npm run install:all --silent
    Write-Success "Toutes les dépendances installées"
}
catch {
    Write-Error "Échec de l'installation des dépendances des workspaces: $($_.Exception.Message)"
    exit 1
}

# Build du projet
Write-Header "Compilation du projet"

Write-Info "Vérification des types TypeScript..."
try {
    npm run type-check --silent
    Write-Success "Vérification des types réussie"
}
catch {
    Write-Warning "Avertissements de types détectés, mais continuons..."
}

if ($Development) {
    Write-Info "Mode développement - compilation en cours..."
    try {
        npm run build --silent
        Write-Success "Compilation terminée"
    }
    catch {
        Write-Error "Échec de la compilation: $($_.Exception.Message)"
        exit 1
    }
}
else {
    Write-Info "Mode production - compilation optimisée..."
    try {
        $env:NODE_ENV = "production"
        npm run build --silent
        Write-Success "Compilation de production terminée"
    }
    catch {
        Write-Error "Échec de la compilation de production: $($_.Exception.Message)"
        exit 1
    }
}

# Création des raccourcis
Write-Header "Configuration des raccourcis"

$desktopPath = [Environment]::GetFolderPath("Desktop")
$startMenuPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"

# Script de lancement
$launchScript = @"
@echo off
cd /d "$InstallPath"
echo Démarrage de Graphite DTF Fusion...
npm run dev
pause
"@

$launchScriptPath = "$InstallPath\launch.bat"
$launchScript | Out-File -FilePath $launchScriptPath -Encoding ASCII

# Raccourci bureau
try {
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$desktopPath\Graphite DTF Fusion.lnk")
    $Shortcut.TargetPath = $launchScriptPath
    $Shortcut.WorkingDirectory = $InstallPath
    $Shortcut.Description = "Éditeur vectoriel DTF professionnel"
    $Shortcut.Save()
    Write-Success "Raccourci bureau créé"
}
catch {
    Write-Warning "Impossible de créer le raccourci bureau: $($_.Exception.Message)"
}

# Raccourci menu démarrer
try {
    $Shortcut = $WshShell.CreateShortcut("$startMenuPath\Graphite DTF Fusion.lnk")
    $Shortcut.TargetPath = $launchScriptPath
    $Shortcut.WorkingDirectory = $InstallPath
    $Shortcut.Description = "Éditeur vectoriel DTF professionnel"
    $Shortcut.Save()
    Write-Success "Raccourci menu démarrer créé"
}
catch {
    Write-Warning "Impossible de créer le raccourci menu démarrer: $($_.Exception.Message)"
}

# Configuration du pare-feu (optionnel)
Write-Header "Configuration réseau"

try {
    Write-Info "Configuration des règles de pare-feu pour le serveur de développement..."
    netsh advfirewall firewall add rule name="Graphite DTF Fusion - Dev Server" dir=in action=allow protocol=TCP localport=3000 2>$null
    Write-Success "Règles de pare-feu configurées"
}
catch {
    Write-Warning "Impossible de configurer le pare-feu automatiquement"
}

# Test de l'installation
Write-Header "Test de l'installation"

Write-Info "Vérification de l'intégrité de l'installation..."

$requiredFiles = @(
    "package.json",
    "frontend\package.json",
    "shared\package.json",
    "frontend\index.html",
    "frontend\src\main.tsx"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success "✓ $file"
    }
    else {
        Write-Error "✗ $file manquant"
        $installationValid = $false
    }
}

if ($installationValid -ne $false) {
    Write-Success "Installation vérifiée avec succès"
}

# Finalisation
Write-Header "Installation terminée"

Write-Success "🎉 Graphite DTF Fusion a été installé avec succès!"
Write-Info ""
Write-Info "📍 Emplacement: $InstallPath"
Write-Info "🌐 URL de développement: http://localhost:3000"
Write-Info ""
Write-ColorOutput "🚀 Pour démarrer l'application:" "Yellow"
Write-Info "   1. Double-cliquez sur le raccourci bureau 'Graphite DTF Fusion'"
Write-Info "   2. Ou exécutez: cd '$InstallPath' && npm run dev"
Write-Info ""
Write-ColorOutput "📚 Documentation:" "Yellow"
Write-Info "   - README.md dans le dossier d'installation"
Write-Info "   - https://github.com/GraphiteDTFFusion/graphite-dtf-fusion"
Write-Info ""
Write-ColorOutput "🆘 Support:" "Yellow"
Write-Info "   - Issues: https://github.com/GraphiteDTFFusion/graphite-dtf-fusion/issues"
Write-Info "   - Documentation: docs/ dans le projet"

if ($Development) {
    Write-Info ""
    Write-ColorOutput "🔧 Mode développement activé:" "Cyan"
    Write-Info "   - Sources modifiables dans: $InstallPath"
    Write-Info "   - Hot reload activé"
    Write-Info "   - DevTools disponibles"
}

Write-Info ""
Write-ColorOutput "⚡ Commandes utiles:" "Yellow"
Write-Info "   npm run dev      - Démarrer en développement"
Write-Info "   npm run build    - Compiler pour la production"
Write-Info "   npm run preview  - Aperçu de la build"
Write-Info "   npm run type-check - Vérifier les types TypeScript"

Write-Info ""
Write-Success "Installation terminée! Vous pouvez maintenant utiliser Graphite DTF Fusion."

# Option pour démarrer immédiatement
Write-Info ""
$startNow = Read-Host "Voulez-vous démarrer l'application maintenant? (o/N)"
if ($startNow -eq "o" -or $startNow -eq "O" -or $startNow -eq "oui") {
    Write-Info "Démarrage de Graphite DTF Fusion..."
    Start-Process "cmd.exe" -ArgumentList "/c", $launchScriptPath
}

Write-ColorOutput "`n🎨 Merci d'utiliser Graphite DTF Fusion!" "Magenta"
Write-ColorOutput "Éditeur vectoriel nouvelle génération pour l'impression DTF professionnelle.`n" "Gray"