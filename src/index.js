import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/fonts/SourceCodePro/SourceCodePro-VariableFont_wght.ttf';
import brandingPalette from './config/brandingPalette';

Object.entries(brandingPalette).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--palette-${key}`, value);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
