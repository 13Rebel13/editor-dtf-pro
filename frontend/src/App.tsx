import React from 'react'
import { Toaster } from 'react-hot-toast'
import { MainEditor } from './components/MainEditor'
import { AppProvider } from './contexts/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <MainEditor />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AppProvider>
  )
}

export default App