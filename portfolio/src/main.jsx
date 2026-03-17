import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { PortfolioProvider } from './context/PortfolioContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PortfolioProvider>
        <App />
        <Toaster position="bottom-right" />
      </PortfolioProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
