/* Geräteübergreifende Synchronisierung des Fortschritts über einen GitHub Gist.
   Lesen funktioniert überall ohne Schlüssel (öffentlicher Gist). Schreiben
   braucht einen einmalig pro Gerät hinterlegten Zugangsschlüssel (Token). */

const GIST_ID = '51b9ba9271f40d4d5d7f6d421bea15a2';
const GIST_FILENAME = 'progress.json';
const TOKEN_KEY = 'elc_gh_token';
const GIST_OVERRIDE_KEY = 'elc_gh_gist_id'; // lokaler Ersatz, solange GIST_ID noch leer ist

const GitHubSync = (() => {
  const status = { connected: !!localStorage.getItem(TOKEN_KEY), lastSync: null, error: null };
  let pushTimer = null;

  function effectiveGistId() {
    return GIST_ID || localStorage.getItem(GIST_OVERRIDE_KEY) || null;
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }

  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    status.connected = !!token;
  }

  function getStatus() {
    return { ...status, gistId: effectiveGistId() };
  }

  // Übersetzt einen HTTP-Status in einen für Nutzer verständlichen Grund,
  // statt nur die rohe Statuszahl anzuzeigen.
  function describeHttpError(status) {
    if (status === 401) return 'Schlüssel ungültig oder abgelaufen — bitte in den Einstellungen einen neuen Zugriffsschlüssel eintragen.';
    if (status === 403) return 'Schlüssel hat nicht die nötige Berechtigung (Gist-Zugriff) oder das Anfragelimit ist erreicht.';
    if (status === 404) return 'Speicherort wurde nicht gefunden — evtl. wurde er gelöscht.';
    return `Unerwarteter Fehler (HTTP ${status}).`;
  }

  async function createGist(token, initialState) {
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Wegweiser Englisch-Lernapp – Fortschritt',
        public: true,
        files: { [GIST_FILENAME]: { content: JSON.stringify(initialState, null, 2) } }
      })
    });
    if (!res.ok) throw new Error(`Gist anlegen fehlgeschlagen: ${describeHttpError(res.status)}`);
    const data = await res.json();
    return data.id;
  }

  async function pull() {
    const id = effectiveGistId();
    if (!id) return null;
    try {
      const res = await fetch(`https://api.github.com/gists/${id}`);
      if (!res.ok) throw new Error(`Laden fehlgeschlagen: ${describeHttpError(res.status)}`);
      const data = await res.json();
      const file = data.files && data.files[GIST_FILENAME];
      if (!file || !file.content) return null;
      const remoteState = JSON.parse(file.content);
      // Ist der lokale Stand neuer als der gerade geladene Remote-Stand (z.B.
      // weil der verzögerte Push einer kurz zuvor gemachten Änderung noch
      // nicht abgeschlossen war, als die Seite neu geladen wurde), NICHT
      // überschreiben - sonst gehen frische lokale Änderungen bei jedem
      // schnellen Reload verloren. Stattdessen den lokalen Stand stattdessen
      // hochladen, damit Remote nachzieht.
      const localState = Store.get();
      if ((localState.updatedAt || 0) > (remoteState.updatedAt || 0)) {
        pushNow();
        status.error = null;
        status.lastSync = new Date().toISOString();
        return localState;
      }
      Store.hydrate(remoteState);
      status.error = null;
      status.lastSync = new Date().toISOString();
      return remoteState;
    } catch (err) {
      status.error = err.message;
      return null;
    }
  }

  async function pushNow() {
    const token = getToken();
    const id = effectiveGistId();
    if (!token || !id) return;
    try {
      const res = await fetch(`https://api.github.com/gists/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: { [GIST_FILENAME]: { content: JSON.stringify(Store.get(), null, 2) } } })
      });
      if (!res.ok) throw new Error(`Speichern fehlgeschlagen: ${describeHttpError(res.status)}`);
      status.error = null;
      status.lastSync = new Date().toISOString();
    } catch (err) {
      status.error = err.message;
    }
  }

  function push() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushNow, 2000);
  }

  async function connect(token) {
    setToken(token);
    let id = effectiveGistId();
    try {
      if (!id) {
        id = await createGist(token, Store.get());
        localStorage.setItem(GIST_OVERRIDE_KEY, id);
      } else {
        await pushNow();
      }
      status.error = null;
      status.lastSync = new Date().toISOString();
    } catch (err) {
      status.error = err.message;
      status.connected = false;
    }
    return getStatus();
  }

  function disconnect() {
    setToken('');
  }

  window.addEventListener('elc:save', push);

  return { pull, push, pushNow, connect, disconnect, getToken, getStatus };
})();
