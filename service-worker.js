/* service-worker.js */
const CACHE_NAME = "betel-cache-v1";
const urlsToCache = [
  "/index.html",
  "/otec.html",
  "/casos.html",
  "/styles.css",
  "/script.js",
  // Agrega aquí otros assets (imágenes, fuentes, etc.) que quieras cachear
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve desde caché si existe; si no, hace fetch real
      return response || fetch(event.request);
    })
  );
});
