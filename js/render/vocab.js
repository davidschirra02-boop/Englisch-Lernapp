/* Vokabeltrainer: Spaced-Repetition-Warteschlange (fällige Karten) plus
   Kategorie-Browser über alle bisher gelernten Wörter. */

function categoryBrowserHtml(words) {
  const byCat = {};
  words.forEach(w => { (byCat[w.category || 'Sonstiges'] = byCat[w.category || 'Sonstiges'] || []).push(w); });
  return `
    <div class="card">
      <h3>Alle gelernten Wörter</h3>
      ${Object.entries(byCat).map(([cat, ws]) => `
        <div style="margin-bottom:14px;">
          <div class="module-label">${cat}</div>
          ${ws.map(w => `<div class="example-box"><span class="en"><strong>${w.word}</strong> — ${w.translation}</span></div>`).join('')}
        </div>`).join('')}
    </div>`;
}

Render.vocab = function (root) {
  const words = getLearnedWords();

  if (words.length === 0) {
    root.innerHTML = `
      <div class="card empty-state">
        <div class="big">📖</div>
        <p>Noch keine Wörter gelernt.</p>
        <p class="muted">Schließe deine erste Tageslektion ab, dann tauchen hier deine Vokabeln zur Wiederholung auf.</p>
        <button class="btn ghost" onclick="goto('#/dashboard')">Zum Dashboard</button>
      </div>`;
    return;
  }

  const s = Store.get();
  const due = words.filter(w => SRS.isDue(s.srs[w.id]));

  if (due.length === 0) {
    root.innerHTML = `
      <div class="card empty-state">
        <div class="big">✅</div>
        <h3>Alles wiederholt!</h3>
        <p class="muted">Du hast aktuell ${words.length} Wörter gelernt. Neue Wiederholungen erscheinen automatisch, sobald sie fällig sind.</p>
      </div>
      ${categoryBrowserHtml(words)}`;
    return;
  }

  let idx = 0;
  showCard();

  function showCard() {
    root.innerHTML = `
      <div class="card">
        <div class="module-label">Wiederholung (${idx + 1}/${due.length})</div>
        <div id="flash-slot"></div>
      </div>`;
    Flashcard.render(root.querySelector('#flash-slot'), due[idx], {
      graded: true,
      onNext: (correct) => {
        SRS.gradeWord(due[idx].id, correct);
        idx++;
        if (idx >= due.length) renderDone();
        else showCard();
      }
    });
  }

  function renderDone() {
    root.innerHTML = `
      <div class="card empty-state">
        <div class="big">🎉</div>
        <h3>Wiederholung abgeschlossen!</h3>
        <p class="muted">Komm morgen wieder für die nächste Runde.</p>
      </div>
      ${categoryBrowserHtml(words)}`;
  }
};
