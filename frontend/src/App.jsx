import { useState } from 'react'
import Home from './pages/Home'
import TemplatesPage from './pages/TemplatesPage'
import TemplateEditor from './pages/TemplateEditor' // Import is already here
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const navigateToHome = () => {
    setCurrentPage('home')
  }

  const navigateToTemplates = () => {
    setCurrentPage('templates')
  }

  // This function is triggered by the "Create Resume" button in TemplatesPage
  const navigateToBuilder = (template) => {
    setSelectedTemplate(template)
    setCurrentPage('builder')
    console.log('Navigating to builder with template:', template)
  }

  return (
    <div className="app">
      {/* 1. HOME PAGE */}
      {currentPage === 'home' && (
        <Home
          onNavigateToTemplates={navigateToTemplates}
        />
      )}

      {/* 2. TEMPLATES PAGE */}
      {currentPage === 'templates' && (
        <TemplatesPage 
          onNavigateHome={navigateToHome}
          onNavigateToBuilder={navigateToBuilder}
        />
      )}

      {/* 3. RESUME BUILDER (TEMPLATE EDITOR) PAGE */}
      {currentPage === 'builder' && (
        <TemplateEditor 
          template={selectedTemplate} 
          onNavigateHome={navigateToTemplates} // Allows user to go back to gallery
        />
      )}
    </div>
  )
}

export default App