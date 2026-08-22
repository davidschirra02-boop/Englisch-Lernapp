/* Router, globaler State-Zugriff und Wortschatz-Hilfsfunktionen. */

const Render = {};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/');
  return { name: parts[0] || 'dashboard', param: parts[1] };
}

function setActiveTab(name) {
  document.querySelectorAll('nav.tabs a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === name);
  });
}

function router() {
  const root = document.getElementById('app-root-content');
  // Verhindert, dass eine laufende Sprachausgabe (z.B. aus dem
  // Hörverständnis-Schritt) beim Verlassen der Seite einfach weiterläuft -
  // die Web Speech API läuft unabhängig vom DOM weiter, bis sie explizit
  // gestoppt wird.
  Speech.stop();
  const { name, param } = currentRoute();
  setActiveTab(name === 'day' ? 'dashboard' : name);
  if (name === 'day') Render.lesson(root, Number(param) || Store.get().currentDay);
  else if (name === 'vocab') Render.vocab(root);
  else if (name === 'grammar') Render.grammar(root);
  else if (name === 'settings') Render.settings(root);
  else Render.dashboard(root);
  window.scrollTo(0, 0);
}

function goto(route) {
  window.location.hash = route;
}

function ensureWordsInSRS(day) {
  const dc = getDayContent(day);
  if (!dc || !dc.content.vocabulary) return;
  dc.content.vocabulary.forEach((w, idx) => SRS.ensureWord(`w${day}-${idx}`));
}

/* Regler-Wert 0..1: 0 = voll durchsichtig (kein Frosted-Glass), 1 = starker Frosted-Glass-Effekt. */
function applyPanelTransparency(v) {
  const alpha = v * 0.65;
  const blur = v * 20;
  const saturate = 100 + v * 50;
  const root = document.documentElement.style;
  root.setProperty('--panel-alpha', alpha.toFixed(3));
  root.setProperty('--panel-blur', blur.toFixed(1) + 'px');
  root.setProperty('--panel-saturate', saturate.toFixed(0) + '%');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/* Mischt ein Array (Fisher-Yates), ohne das Original zu verändern. Genutzt
   von Vokabeltrainer und Grammatik-Tab für zufällig gemischte Übungsrunden. */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', async () => {
  await GitHubSync.pull();
  Store.touchToday();
  applyPanelTransparency(Store.get().panelAlpha);
  applyTheme(Store.get().theme || 'glass');
  router();
});
