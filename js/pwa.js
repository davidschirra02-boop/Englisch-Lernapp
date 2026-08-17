/* Registriert den Service Worker, damit die Seite auf dem Handy als App
   installierbar ist (Homescreen-Icon, Vollbild ohne Adressleiste). */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}
