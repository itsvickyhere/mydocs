import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import App from './App'

// MUI theme — Livvic font, clean palette
const theme = createTheme({
  typography: {
    fontFamily: '"Livvic", sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resets browser styles */}
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
)
