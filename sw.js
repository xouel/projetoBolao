const CACHE_NAME = "bolao-familia-v1";
// Lista de arquivos estáticos que serão salvos no celular do usuário
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./app.js",
  "./api.js",
  "./admin.js",
  "./manifest.json"
  // Adicione aqui seus arquivos de CSS (ex: ./style.css) ou imagens fixas se houver
];

// 1. Instalação: Salva os arquivos estruturais no cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Fazendo cache da estrutura do app");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Ativação: Limpa caches antigos caso você atualize o app futuramente
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Interceptação: Serve os arquivos do cache rápido (Cache First)
// Mas deixa passar direto as requisições da planilha do Google (Network Only)
self.addEventListener("fetch", (e) => {
  // Se a requisição for para a API do Google Sheets, NÃO passa pelo cache!
  if (e.request.url.includes("script.google.com")) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});