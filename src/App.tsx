import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Home } from './pages/home'
import { TrackerProvider } from './contexts/track/TrackerContext'

const collors = {
  background: '#2F2F2F',
  footer: '#161616',
}

function App() {
  return (
    <TrackerProvider>
      <ThemeProvider theme={collors}>
        <Home />
      </ThemeProvider>
    </TrackerProvider>
  )
}

export default App
