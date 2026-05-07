import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import brandingPalette from './config/brandingPalette';

Object.entries(brandingPalette).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--palette-${key}`, value);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
