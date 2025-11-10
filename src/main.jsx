import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)

// Registrar Service Worker para cache e performance
serviceWorkerRegistration.register({
  onSuccess: () => console.log('✅ App pronto para funcionar offline!'),
  onUpdate: () => console.log('🔄 Nova versão disponível! Recarregue a página.')
})
