import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import './styles.css'
import App from './App.tsx'

const theme = createTheme({
  primaryColor: 'evergreen',
  colors: {
    evergreen: ['#f3f7f5', '#eaf2ee', '#ddece4', '#bfd8ca', '#99bfaa', '#6f9c83', '#467d61', '#24664f', '#1e513f', '#19382c'],
  },
  primaryShade: 7,
  fontFamily: '"DM Sans Variable", system-ui, sans-serif',
  headings: { fontFamily: '"Bricolage Grotesque Variable", system-ui, sans-serif' },
  defaultRadius: 'md',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} forceColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
)
