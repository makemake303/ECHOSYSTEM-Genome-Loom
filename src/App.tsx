import React from 'react'
import AnatomyPanel from './components/AnatomyPanel'
import GenomeCanvas from './components/GenomeCanvas'
import OrganismPreview from './components/OrganismPreview'
import Toolbar from './components/Toolbar'
import { GenomeProvider } from './state/useGenome'

export default function App() {
  return (
    <GenomeProvider>
      <div className="app-root">
        <div className="left-panel">
          <AnatomyPanel />
        </div>
        <div className="center-panel">
          <Toolbar />
          <GenomeCanvas />
        </div>
        <div className="right-panel">
          <OrganismPreview />
        </div>
      </div>
    </GenomeProvider>
  )
}
