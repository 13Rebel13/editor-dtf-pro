import React, { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  FileText,
  Palette,
  Upload,
  Scan,
  Download
} from 'lucide-react'
import { PlateSelector } from '../plates/PlateSelector'
import { BackgroundSelector } from '../backgrounds/BackgroundSelector'
import { useStore } from '../../store/useStore'
import type { DTFPlateFormat, Background } from '../../../../shared/src/types/index.js'

type WorkflowStep = 'format' | 'background' | 'content' | 'analysis' | 'export'

interface WorkflowStepConfig {
  id: WorkflowStep
  title: string
  description: string
  icon: React.ReactNode
  completed?: boolean
}

export function DTFWorkflow() {
  const { createProject, toggleWorkflow } = useStore()
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('format')
  const [projectName, setProjectName] = useState('Nouveau projet DTF')
  const [selectedFormat, setSelectedFormat] = useState<DTFPlateFormat | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null)

  const steps: WorkflowStepConfig[] = [
    {
      id: 'format',
      title: 'Choix du format',
      description: 'Sélectionnez le format de planche DTF',
      icon: <FileText className="w-6 h-6" />,
      completed: !!selectedFormat
    },
    {
      id: 'background',
      title: 'Arrière-plan',
      description: 'Choisissez l\'arrière-plan de votre planche',
      icon: <Palette className="w-6 h-6" />,
      completed: !!selectedBackground
    },
    {
      id: 'content',
      title: 'Contenu',
      description: 'Ajoutez vos éléments (images, texte, formes)',
      icon: <Upload className="w-6 h-6" />,
      completed: false
    },
    {
      id: 'analysis',
      title: 'Analyse DTF',
      description: 'Vérifiez la qualité pour l\'impression DTF',
      icon: <Scan className="w-6 h-6" />,
      completed: false
    },
    {
      id: 'export',
      title: 'Export',
      description: 'Exportez votre projet final',
      icon: <Download className="w-6 h-6" />,
      completed: false
    }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const canGoNext = () => {
    switch (currentStep) {
      case 'format':
        return !!selectedFormat
      case 'background':
        return !!selectedBackground
      default:
        return true
    }
  }

  const canGoPrevious = () => currentStepIndex > 0

  const handleNext = () => {
    if (currentStep === 'background' && selectedFormat && selectedBackground) {
      // Create project and go to editor
      createProject(projectName, selectedFormat)
      // Set background after project creation
      setTimeout(() => {
        useStore.getState().setProjectBackground(selectedBackground)
      }, 100)
      return
    }

    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]!.id)
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]!.id)
    }
  }

  const handleStepClick = (stepId: WorkflowStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    
    // Allow going to previous steps or next step if current is completed
    if (stepIndex <= currentIndex || (stepIndex === currentIndex + 1 && steps[currentIndex]?.completed)) {
      setCurrentStep(stepId)
    }
  }

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar with steps */}
      <div className="w-80 bg-dtf-muted border-r border-dtf-border">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-dtf-primary-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dtf-foreground">
                Workflow DTF
              </h1>
              <p className="text-sm text-dtf-muted-foreground">
                Assistant de création guidée
              </p>
            </div>
          </div>

          {/* Project name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dtf-foreground mb-2">
              Nom du projet
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="dtf-input w-full"
              placeholder="Entrez le nom du projet"
            />
          </div>

          {/* Steps list */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={index > currentStepIndex + 1}
                className={`
                  w-full text-left p-4 rounded-lg border transition-all
                  ${step.id === currentStep
                    ? 'bg-dtf-primary-50 border-dtf-primary-200 text-dtf-primary-900'
                    : step.completed
                    ? 'bg-dtf-success-50 border-dtf-success-200 text-dtf-success-900 hover:bg-dtf-success-100'
                    : index <= currentStepIndex
                    ? 'bg-background border-dtf-border text-dtf-foreground hover:bg-dtf-muted'
                    : 'bg-dtf-muted border-dtf-border text-dtf-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step.completed 
                      ? 'bg-dtf-success-500 text-white' 
                      : step.id === currentStep
                      ? 'bg-dtf-primary-500 text-white'
                      : 'bg-dtf-secondary-200 text-dtf-secondary-600'
                    }
                  `}>
                    {step.completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{step.title}</h3>
                    <p className="text-xs opacity-70">{step.description}</p>
                  </div>
                  {step.icon}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-dtf-border p-6">
          <h2 className="text-2xl font-bold text-dtf-foreground mb-2">
            {steps.find(s => s.id === currentStep)?.title}
          </h2>
          <p className="text-dtf-muted-foreground">
            {steps.find(s => s.id === currentStep)?.description}
          </p>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-auto">
          {currentStep === 'format' && (
            <FormatStep 
              selectedFormat={selectedFormat}
              onFormatSelect={setSelectedFormat}
            />
          )}
          
          {currentStep === 'background' && (
            <BackgroundStep
              selectedBackground={selectedBackground}
              onBackgroundSelect={setSelectedBackground}
            />
          )}
          
          {currentStep === 'content' && (
            <ContentStep />
          )}
          
          {currentStep === 'analysis' && (
            <AnalysisStep />
          )}
          
          {currentStep === 'export' && (
            <ExportStep />
          )}
        </div>

        {/* Footer with navigation */}
        <div className="border-t border-dtf-border p-6 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious()}
            className="dtf-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleWorkflow()}
              className="dtf-btn-ghost"
            >
              Passer le workflow
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="dtf-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 'background' ? 'Créer le projet' : 'Suivant'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormatStep({ 
  selectedFormat, 
  onFormatSelect 
}: { 
  selectedFormat: DTFPlateFormat | null
  onFormatSelect: (format: DTFPlateFormat) => void 
}) {
  return (
    <div className="p-6">
      <PlateSelector 
        selectedFormat={selectedFormat}
        onFormatSelect={onFormatSelect}
      />
    </div>
  )
}

function BackgroundStep({ 
  selectedBackground, 
  onBackgroundSelect 
}: { 
  selectedBackground: Background | null
  onBackgroundSelect: (background: Background) => void 
}) {
  return (
    <div className="p-6">
      <BackgroundSelector
        selectedBackground={selectedBackground}
        onBackgroundSelect={onBackgroundSelect}
      />
    </div>
  )
}

function ContentStep() {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <Upload className="w-16 h-16 text-dtf-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dtf-foreground mb-2">
          Ajout de contenu
        </h3>
        <p className="text-dtf-muted-foreground mb-6">
          Cette étape sera disponible dans l'éditeur principal
        </p>
        <div className="text-sm text-dtf-muted-foreground">
          <p>Vous pourrez :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Importer des images par glisser-déposer</li>
            <li>Ajouter du texte avec Google Fonts</li>
            <li>Créer des formes vectorielles</li>
            <li>Organiser en calques</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function AnalysisStep() {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <Scan className="w-16 h-16 text-dtf-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dtf-foreground mb-2">
          Analyse DTF
        </h3>
        <p className="text-dtf-muted-foreground mb-6">
          L'analyseur DTF vérifiera automatiquement votre design
        </p>
        <div className="text-sm text-dtf-muted-foreground">
          <p>Vérifications incluses :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Traits minimum 0.5mm</li>
            <li>Espacement minimum 1mm</li>
            <li>Résolution des images 300 DPI</li>
            <li>Espaces colorimétriques</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function ExportStep() {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <Download className="w-16 h-16 text-dtf-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dtf-foreground mb-2">
          Export professionnel
        </h3>
        <p className="text-dtf-muted-foreground mb-6">
          Exportez votre projet dans différents formats
        </p>
        <div className="text-sm text-dtf-muted-foreground">
          <p>Formats disponibles :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>SVG vectoriel (qualité maximale)</li>
            <li>PNG 300 DPI (impression)</li>
            <li>PDF print-ready avec métadonnées</li>
          </ul>
        </div>
      </div>
    </div>
  )
}