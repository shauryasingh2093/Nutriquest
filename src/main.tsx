import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './utils/storageProtection' // Add localStorage logging

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
