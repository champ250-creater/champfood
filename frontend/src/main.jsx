import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { startPerformanceMonitoring } from './utils/performance.js'
import './index.css'

startPerformanceMonitoring()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
