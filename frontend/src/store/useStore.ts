import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { 
  DTFProject, 
  CanvasState, 
  CanvasElement, 
  DTFPlateFormat, 
  Background 
} from '../../../shared/src/types/index.js'
import { DTF_PLATE_FORMATS } from '../../../shared/src/types/index.js'

interface AppState {
  // UI State
  theme: 'light' | 'dark'
  showWorkflow: boolean
  showGrid: boolean
  showGuides: boolean
  showRulers: boolean
  snapToGrid: boolean
  snapToGuides: boolean
  
  // Canvas State
  canvas: CanvasState
  
  // Current project
  currentProject: DTFProject | null
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  toggleWorkflow: () => void
  toggleGrid: () => void
  toggleGuides: () => void
  toggleRulers: () => void
  toggleSnapToGrid: () => void
  toggleSnapToGuides: () => void
  
  // Project actions
  createProject: (name: string, format: DTFPlateFormat) => void
  loadProject: (project: DTFProject) => void
  updateProject: (updates: Partial<DTFProject>) => void
  setProjectBackground: (background: Background) => void
  
  // Canvas actions
  setTool: (tool: CanvasState['tool']) => void
  setZoom: (zoom: number) => void
  setPan: (panX: number, panY: number) => void
  selectElements: (elementIds: string[]) => void
  addElement: (element: CanvasElement) => void
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void
  deleteElements: (elementIds: string[]) => void
  
  // History actions
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

const defaultFormat = DTF_PLATE_FORMATS[0] // 55x100cm

const createDefaultProject = (name: string, format: DTFPlateFormat): DTFProject => ({
  id: uuidv4(),
  name,
  format,
  background: {
    type: 'solid',
    color: '#ffffff'
  },
  layers: [{
    id: uuidv4(),
    name: 'Calque 1',
    visible: true,
    locked: false,
    opacity: 1,
    elements: [],
    zIndex: 0
  }],
  zoom: 1,
  panX: 0,
  panY: 0,
  gridVisible: true,
  guidesVisible: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {
    version: '1.0.0',
    dpi: 300,
    colorProfile: 'sRGB',
    bleed: 3 // 3mm de fond perdu
  }
})

export const useStore = create<AppState>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // Initial UI state
        theme: 'light',
        showWorkflow: true,
        showGrid: true,
        showGuides: true,
        showRulers: true,
        snapToGrid: true,
        snapToGuides: true,
        
        // Initial canvas state
        canvas: {
          project: null,
          selectedElements: [],
          clipboard: [],
          history: {
            past: [],
            present: null,
            future: []
          },
          tool: 'select',
          isDrawing: false,
          isDragging: false,
          showGrid: true,
          showGuides: true,
          showRulers: true,
          snapToGrid: true,
          snapToGuides: true
        },
        
        currentProject: null,
        
        // UI Actions
        setTheme: (theme) => set({ theme }),
        toggleWorkflow: () => set((state) => ({ showWorkflow: !state.showWorkflow })),
        toggleGrid: () => set((state) => ({ 
          showGrid: !state.showGrid,
          canvas: { ...state.canvas, showGrid: !state.showGrid }
        })),
        toggleGuides: () => set((state) => ({ 
          showGuides: !state.showGuides,
          canvas: { ...state.canvas, showGuides: !state.showGuides }
        })),
        toggleRulers: () => set((state) => ({ 
          showRulers: !state.showRulers,
          canvas: { ...state.canvas, showRulers: !state.showRulers }
        })),
        toggleSnapToGrid: () => set((state) => ({ 
          snapToGrid: !state.snapToGrid,
          canvas: { ...state.canvas, snapToGrid: !state.snapToGrid }
        })),
        toggleSnapToGuides: () => set((state) => ({ 
          snapToGuides: !state.snapToGuides,
          canvas: { ...state.canvas, snapToGuides: !state.snapToGuides }
        })),
        
        // Project Actions
        createProject: (name, format) => {
          const project = createDefaultProject(name, format)
          set({ 
            currentProject: project,
            canvas: { ...get().canvas, project },
            showWorkflow: false
          })
        },
        
        loadProject: (project) => {
          set({ 
            currentProject: project,
            canvas: { ...get().canvas, project }
          })
        },
        
        updateProject: (updates) => {
          const current = get().currentProject
          if (!current) return
          
          const updated = { 
            ...current, 
            ...updates, 
            updatedAt: new Date() 
          }
          
          set({ 
            currentProject: updated,
            canvas: { ...get().canvas, project: updated }
          })
        },
        
        setProjectBackground: (background) => {
          const current = get().currentProject
          if (!current) return
          
          get().updateProject({ background })
        },
        
        // Canvas Actions
        setTool: (tool) => set((state) => ({
          canvas: { ...state.canvas, tool }
        })),
        
        setZoom: (zoom) => {
          const current = get().currentProject
          if (!current) return
          
          get().updateProject({ zoom })
        },
        
        setPan: (panX, panY) => {
          const current = get().currentProject
          if (!current) return
          
          get().updateProject({ panX, panY })
        },
        
        selectElements: (elementIds) => set((state) => ({
          canvas: { ...state.canvas, selectedElements: elementIds }
        })),
        
        addElement: (element) => {
          const current = get().currentProject
          if (!current) return
          
          const updatedLayers = current.layers.map(layer => {
            if (layer.zIndex === 0) { // Add to first layer for now
              return {
                ...layer,
                elements: [...layer.elements, element]
              }
            }
            return layer
          })
          
          get().updateProject({ layers: updatedLayers })
          get().saveToHistory()
        },
        
        updateElement: (elementId, updates) => {
          const current = get().currentProject
          if (!current) return
          
          const updatedLayers = current.layers.map(layer => ({
            ...layer,
            elements: layer.elements.map(element => 
              element.id === elementId 
                ? { ...element, ...updates, updatedAt: new Date() }
                : element
            )
          }))
          
          get().updateProject({ layers: updatedLayers })
        },
        
        deleteElements: (elementIds) => {
          const current = get().currentProject
          if (!current) return
          
          const updatedLayers = current.layers.map(layer => ({
            ...layer,
            elements: layer.elements.filter(element => 
              !elementIds.includes(element.id)
            )
          }))
          
          get().updateProject({ layers: updatedLayers })
          get().selectElements([])
          get().saveToHistory()
        },
        
        // History Actions
        saveToHistory: () => {
          const state = get()
          if (!state.currentProject) return
          
          set((prevState) => ({
            canvas: {
              ...prevState.canvas,
              history: {
                past: [...prevState.canvas.history.past, prevState.currentProject!],
                present: prevState.currentProject,
                future: []
              }
            }
          }))
        },
        
        undo: () => {
          const state = get()
          const { past, present, future } = state.canvas.history
          
          if (past.length === 0) return
          
          const previous = past[past.length - 1]
          const newPast = past.slice(0, past.length - 1)
          
          set({
            currentProject: previous,
            canvas: {
              ...state.canvas,
              project: previous,
              history: {
                past: newPast,
                present: previous,
                future: present ? [present, ...future] : future
              }
            }
          })
        },
        
        redo: () => {
          const state = get()
          const { past, present, future } = state.canvas.history
          
          if (future.length === 0) return
          
          const next = future[0]
          const newFuture = future.slice(1)
          
          set({
            currentProject: next,
            canvas: {
              ...state.canvas,
              project: next,
              history: {
                past: present ? [...past, present] : past,
                present: next,
                future: newFuture
              }
            }
          })
        }
      })
    ),
    { name: 'dtf-fusion-store' }
  )
)