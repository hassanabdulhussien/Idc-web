import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// diagnostic log to confirm the client bundle runs in production
console.log('IDC: main.jsx loaded')

try {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (err) {
  // re-throw asynchronously so our index.html overlay captures it as an unhandled error
  setTimeout(() => { throw err })
}
