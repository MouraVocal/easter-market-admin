import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'
import { theme } from './styles/theme'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>,
)
