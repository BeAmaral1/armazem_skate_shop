/* eslint-disable no-restricted-globals */
// Service Worker para cache de assets e melhor performance

const CACHE_NAME = 'armazem-skate-v1';
const RUNTIME_CACHE = 'armazem-runtime-v1';

// Assets para cachear na instalação
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Instalação - cachear assets críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Ativação - limpar caches antigos
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch - estratégia de cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requisições de API externa
  if (event.request.url.includes('api') || event.request.url.includes('analytics')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME_CACHE)
          .then((cache) => {
            return fetch(event.request)
              .then((response) => {
                // Cachear apenas respostas válidas
                if (response && response.status === 200) {
                  // Clonar porque response é stream
                  cache.put(event.request, response.clone());
                }
                return response;
              })
              .catch(() => {
                // Se offline, tentar servir página offline
                return caches.match('/index.html');
              });
          });
      })
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
