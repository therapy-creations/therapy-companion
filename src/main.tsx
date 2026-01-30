import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from './App'
import { Toaster } from './components/ui/sonner'
import './index.css' // Keep this at the absolute bottom of imports

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    [data-sonner-toaster] [data-button="true"],
    [data-sonner-toaster] a.bg-primary,
    [data-sonner-toaster] .bg-primary {
      background-color: #adb8ed !important;
      background: #adb8ed !important;
      color: white !important;
    }
  `;
  document.head.appendChild(style);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
)
