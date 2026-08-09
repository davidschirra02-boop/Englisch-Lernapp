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
  const { name, param } = currentRoute();
  setActiveTab(name === 'day' ? 'dashboard' : name);
  if (name === 'day') Render.lesson(root, Number(param) || Store.get().currentDay);
  else if (name === 'vocab') Render.vocab(root);
  else if (name === 'settings') Render.settings(root);
  else Render.dashboard(root);
  window.scrollTo(0, 0);
}

function goto(route) {
  window.location.hash = route;
}

/* Sammelt alle Vokabeln aus bereits abgeschlossenen Tagen für den SRS-Trainer. */
function getLearnedWords() {
  const s = Store.get();
  const words = [];
  Object.keys(s.completedDays).map(Number).sort((a, b) => a - b).forEach(day => {
    const dc = getDayContent(day);
    if (dc && dc.content.vocabulary) {
      dc.content.vocabulary.forEach((w, idx) => words.push({ id: `w${day}-${idx}`, day, ...w }));
    }
  });
  return words;
}

function ensureWordsInSRS(day) {
  const dc = getDayContent(day);
  if (!dc || !dc.content.vocabulary) return;
  dc.content.vocabulary.forEach((w, idx) => SRS.ensureWord(`w${day}-${idx}`));
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  Store.touchToday();
  document.documentElement.style.setProperty('--panel-alpha', Store.get().panelAlpha);
  router();
});
