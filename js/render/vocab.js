/* Vokabeltrainer: Spaced-Repetition-Warteschlange (fällige Karten) plus
   Kategorie-Browser über alle bisher gelernten Wörter. Vor jeder
   Wiederholungsrunde wird die Abfragerichtung gewählt (Englisch → Deutsch
   oder Deutsch → Englisch) und für die gesamte Runde beibehalten. Am Ende
   werden die falsch bewerteten Wörter noch einmal aufgelistet. */

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

  renderDirectionChoice();

  function renderDirectionChoice() {
    const dir = s.vocabDirection || 'en-de';
    root.innerHTML = `
      <div class="card">
        <h3>Wiederholung (${due.length} fällig)</h3>
        <p class="muted">In welche Richtung möchtest du übersetzen?</p>
        <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;">
          <button class="btn ${dir === 'en-de' ? '' : 'ghost'}" id="dir-en-de">Englisch → Deutsch</button>
          <button class="btn ${dir === 'de-en' ? '' : 'ghost'}" id="dir-de-en">Deutsch → Englisch</button>
        </div>
      </div>`;
    root.querySelector('#dir-en-de').addEventListener('click', () => startReview('en-de'));
    root.querySelector('#dir-de-en').addEventListener('click', () => startReview('de-en'));
  }

  function startReview(direction) {
    Store.update(st => { st.vocabDirection = direction; });
    let idx = 0;
    const wrongWords = [];
    showCard();

    function showCard() {
      root.innerHTML = `
        <div class="card">
          <div class="module-label">Wiederholung (${idx + 1}/${due.length})</div>
          <div id="flash-slot"></div>
        </div>`;
      Flashcard.render(root.querySelector('#flash-slot'), due[idx], {
        graded: true,
        reversed: direction === 'de-en',
        onNext: (correct) => {
          SRS.gradeWord(due[idx].id, correct);
          if (!correct) wrongWords.push(due[idx]);
          idx++;
          if (idx >= due.length) renderSessionDone();
          else showCard();
        }
      });
    }

    function renderSessionDone() {
      root.innerHTML = `
        <div class="card empty-state">
          <div class="big">🎉</div>
          <h3>Wiederholung abgeschlossen!</h3>
          <p class="muted">Komm morgen wieder für die nächste Runde.</p>
        </div>
        ${wrongWords.length > 0 ? `
          <div class="card">
            <h3>Diese Wörter saßen noch nicht</h3>
            ${wrongWords.map(w => `<div class="example-box"><span class="en"><strong>${w.word}</strong> — ${w.translation}</span></div>`).join('')}
          </div>` : ''}
        ${categoryBrowserHtml(words)}`;
    }
  }
};
