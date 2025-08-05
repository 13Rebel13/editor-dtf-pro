import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { 
  Project, 
  Plate, 
  UploadedFile, 
  PlateElement, 
  TextElement, 
  PlateFormat, 
  BackgroundType,
  PlateStats,
  generateId
} from '@dtf-editor/shared'

// Types pour les actions du reducer
type AppAction = 
  | { type: 'SET_PROJECT'; payload: Project }
  | { type: 'CREATE_NEW_PROJECT'; payload: { name: string } }
  | { type: 'ADD_PLATE'; payload: { format: PlateFormat } }
  | { type: 'SET_CURRENT_PLATE'; payload: string }
  | { type: 'ADD_UPLOADED_FILE'; payload: UploadedFile }
  | { type: 'REMOVE_UPLOADED_FILE'; payload: string }
  | { type: 'ADD_ELEMENT_TO_PLATE'; payload: { plateId: string; element: PlateElement } }
  | { type: 'UPDATE_ELEMENT'; payload: { plateId: string; elementId: string; updates: Partial<PlateElement> } }
  | { type: 'REMOVE_ELEMENT'; payload: { plateId: string; elementId: string } }
  | { type: 'ADD_TEXT_ELEMENT'; payload: { plateId: string; textElement: TextElement } }
  | { type: 'UPDATE_TEXT_ELEMENT'; payload: { plateId: string; textElementId: string; updates: Partial<TextElement> } }
  | { type: 'REMOVE_TEXT_ELEMENT'; payload: { plateId: string; textElementId: string } }
  | { type: 'SET_PLATE_BACKGROUND'; payload: { plateId: string; backgroundType: BackgroundType } }
  | { type: 'CLEAR_PLATE'; payload: string }
  | { type: 'SET_SELECTED_ELEMENT'; payload: { type: 'element' | 'text' | null; id: string | null } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

// État de l'application
interface AppState {
  project: Project | null
  currentPlateId: string | null
  uploadedFiles: UploadedFile[]
  selectedElement: { type: 'element' | 'text' | null; id: string | null }
  loading: boolean
  error: string | null
}

// État initial
const initialState: AppState = {
  project: null,
  currentPlateId: null,
  uploadedFiles: [],
  selectedElement: { type: null, id: null },
  loading: false,
  error: null
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROJECT':
      return {
        ...state,
        project: action.payload,
        currentPlateId: action.payload.plates[0]?.id || null
      }

    case 'CREATE_NEW_PROJECT': {
      const plateId = generateId()
      const newProject: Project = {
        id: generateId(),
        name: action.payload.name,
        plates: [{
          id: plateId,
          format: PlateFormat.LARGE,
          elements: [],
          textElements: [],
          backgroundType: BackgroundType.GRID_LIGHT,
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return {
        ...state,
        project: newProject,
        currentPlateId: plateId
      }
    }

    case 'ADD_PLATE': {
      if (!state.project) return state
      
      const newPlate: Plate = {
        id: generateId(),
        format: action.payload.format,
        elements: [],
        textElements: [],
        backgroundType: BackgroundType.GRID_LIGHT,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: [...state.project.plates, newPlate],
          updatedAt: new Date()
        }
      }
    }

    case 'SET_CURRENT_PLATE':
      return {
        ...state,
        currentPlateId: action.payload,
        selectedElement: { type: null, id: null }
      }

    case 'ADD_UPLOADED_FILE':
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, action.payload]
      }

    case 'REMOVE_UPLOADED_FILE':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(file => file.id !== action.payload)
      }

    case 'ADD_ELEMENT_TO_PLATE': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload.plateId
              ? { ...plate, elements: [...plate.elements, action.payload.element], updatedAt: new Date() }
              : plate
          ),
          updatedAt: new Date()
        }
      }
    }

    case 'UPDATE_ELEMENT': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload.plateId
              ? {
                  ...plate,
                  elements: plate.elements.map(element =>
                    element.id === action.payload.elementId
                      ? { ...element, ...action.payload.updates }
                      : element
                  ),
                  updatedAt: new Date()
                }
              : plate
          ),
          updatedAt: new Date()
        }
      }
    }

    case 'REMOVE_ELEMENT': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload.plateId
              ? {
                  ...plate,
                  elements: plate.elements.filter(element => element.id !== action.payload.elementId),
                  updatedAt: new Date()
                }
              : plate
          ),
          updatedAt: new Date()
        },
        selectedElement: state.selectedElement.id === action.payload.elementId 
          ? { type: null, id: null }
          : state.selectedElement
      }
    }

    case 'ADD_TEXT_ELEMENT': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload.plateId
              ? { ...plate, textElements: [...plate.textElements, action.payload.textElement], updatedAt: new Date() }
              : plate
          ),
          updatedAt: new Date()
        }
      }
    }

    case 'UPDATE_TEXT_ELEMENT': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload.plateId
              ? {
                  ...plate,
                  textElements: plate.textElements.map(textElement =>
                    textElement.id === action.payload.textElementId
                      ? { ...textElement, ...action.payload.updates }
                      : textElement
                  ),
                  updatedAt: new Date()
                }
              : plate
          ),
          updatedAt: new Date()
        }
      }
    }

    case 'REMOVE_TEXT_ELEMENT': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload.plateId
              ? {
                  ...plate,
                  textElements: plate.textElements.filter(textElement => textElement.id !== action.payload.textElementId),
                  updatedAt: new Date()
                }
              : plate
          ),
          updatedAt: new Date()
        },
        selectedElement: state.selectedElement.id === action.payload.textElementId 
          ? { type: null, id: null }
          : state.selectedElement
      }
    }

    case 'SET_PLATE_BACKGROUND': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload.plateId
              ? { ...plate, backgroundType: action.payload.backgroundType, updatedAt: new Date() }
              : plate
          ),
          updatedAt: new Date()
        }
      }
    }

    case 'CLEAR_PLATE': {
      if (!state.project) return state
      
      return {
        ...state,
        project: {
          ...state.project,
          plates: state.project.plates.map(plate =>
            plate.id === action.payload
              ? { ...plate, elements: [], textElements: [], updatedAt: new Date() }
              : plate
          ),
          updatedAt: new Date()
        },
        selectedElement: { type: null, id: null }
      }
    }

    case 'SET_SELECTED_ELEMENT':
      return {
        ...state,
        selectedElement: action.payload
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }

    default:
      return state
  }
}

// Interface du contexte
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Fonctions utilitaires
  getCurrentPlate: () => Plate | null
  getPlateStats: (plateId: string) => PlateStats | null
  getFileById: (fileId: string) => UploadedFile | null
}

// Création du contexte
const AppContext = createContext<AppContextType | undefined>(undefined)

// Hook pour utiliser le contexte
export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Provider du contexte
interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Fonctions utilitaires
  const getCurrentPlate = (): Plate | null => {
    if (!state.project || !state.currentPlateId) return null
    return state.project.plates.find(plate => plate.id === state.currentPlateId) || null
  }

  const getPlateStats = (plateId: string): PlateStats | null => {
    const plate = state.project?.plates.find(p => p.id === plateId)
    if (!plate) return null

    // Calcul des statistiques (implémentation simplifiée)
    const elementCount = plate.elements.length
    const textElementCount = plate.textElements.length
    const usedArea = 0 // À calculer avec les vraies dimensions
    const totalArea = 0 // À calculer selon le format de planche
    const efficiency = 0 // Pourcentage d'utilisation

    return {
      usedArea,
      totalArea,
      efficiency,
      elementCount,
      textElementCount
    }
  }

  const getFileById = (fileId: string): UploadedFile | null => {
    return state.uploadedFiles.find(file => file.id === fileId) || null
  }

  const contextValue: AppContextType = {
    state,
    dispatch,
    getCurrentPlate,
    getPlateStats,
    getFileById
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}