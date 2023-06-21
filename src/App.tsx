import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Home } from './pages/home'

const collors = {
  background: '#2F2F2F',
  footer: '#161616'
}

function App(): JSX.Element {
  return (
    <ThemeProvider theme={collors}>
      <Home/>
    </ThemeProvider>
  )
}

export default App
