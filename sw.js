/* Minimaler Service Worker - existiert nur, damit Android/Chrome die Seite
   als installierbar erkennt. Kein Offline-Caching (bewusst nicht gewünscht,
   die App braucht ohnehin Internet für die Fortschritts-Synchronisierung). */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
