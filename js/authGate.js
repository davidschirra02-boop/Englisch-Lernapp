/* Einfacher client-seitiger Passwortschutz für die öffentliche Live-Seite.
   WICHTIG: Das ist KEIN echter Zugriffsschutz - jede Datei bleibt über ihre
   direkte URL weiterhin abrufbar, da GitHub Pages keine serverseitige
   Authentifizierung anbietet. Diese Sperre verhindert nur das normale,
   zufällige Aufrufen/Durchklicken der Startseite durch Unbeteiligte. */

(function () {
  const STORAGE_KEY = 'elc_auth_ok';
  const PASSWORD = 'EngLernApp';

  const gate = document.getElementById('auth-gate');
  if (!gate) return;

  if (localStorage.getItem(STORAGE_KEY) === '1') {
    gate.remove();
    return;
  }

  const form = document.getElementById('auth-gate-form');
  const input = document.getElementById('auth-gate-input');
  const error = document.getElementById('auth-gate-error');

  input.focus();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      gate.remove();
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
})();
