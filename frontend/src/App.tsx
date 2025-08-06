import React from 'react'
import { Editor } from './components/Editor'
import { ThemeProvider } from './components/common/ThemeProvider'
import { DTFWorkflow } from './components/workflow/DTFWorkflow'
import { useStore } from './store/useStore'

export function App() {
  const { showWorkflow } = useStore()

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background text-foreground">
        {showWorkflow ? (
          <DTFWorkflow />
        ) : (
          <Editor />
        )}
      </div>
    </ThemeProvider>
  )
}