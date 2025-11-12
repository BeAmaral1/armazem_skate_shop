import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
)

// DESATIVADO TEMPORARIAMENTE - Service Worker causa problema de cache durante desenvolvimento
// serviceWorkerRegistration.register({
//   onSuccess: () => console.log('✅ App pronto para funcionar offline!'),
//   onUpdate: () => console.log('🔄 Nova versão disponível! Recarregue a página.')
// })

// Desregistrar service workers existentes
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}
