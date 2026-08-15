/* Vokabeltrainer: Übersicht ("Hub") mit allen Kapiteln (= Vokabel-Kategorien,
   entsprechen den Wochenthemen). Von dort aus wählt man ein Kapitel (oder
   "alle gemischt") und dann die Abfragerichtung (Englisch → Deutsch /
   Deutsch → Englisch). Übungen sind jederzeit wiederholbar, nicht nur wenn
   Karten laut SRS fällig sind — der Fällig-Status wird nur noch als Hinweis
   pro Kapitel angezeigt. Am Ende einer Runde werden falsch bewertete Wörter
   noch einmal aufgelistet, plus die Wahl, direkt nur diese oder wieder
   alle Vokabeln aus allen Kapiteln zu üben.

   Für Abwechslung wird pro Karte zufällig eine von zwei Übungsarten
   gewählt: klassische Flashcard (umdrehen + selbst einschätzen) oder
   Lückentext (die Wendung im Beispielsatz ergänzen, falls sie dort
   wörtlich vorkommt — sonst bleibt es bei Flashcard). */

/* Sucht die Wendung `word.word` im Beispielsatz, um daraus eine Lücke zu
   bauen. Versucht auch ohne führendes "to " (Infinitiv-Partikel steht oft
   nicht in derselben Form im Satz). Liefert null, wenn kein wörtlicher
   Treffer existiert (z. B. bei konjugierten Formen wie "oneself"→"myself"). */
function findGapBlank(word) {
  const ex = word.example || '';
  const candidates = [word.word, word.word.replace(/^to /i, '')];
  for (const c of candidates) {
    const idx = ex.toLowerCase().indexOf(c.toLowerCase());
    if (idx !== -1) {
      return { before: ex.slice(0, idx), target: ex.slice(idx, idx + c.length), after: ex.slice(idx + c.length) };
    }
  }
  return null;
}

function pickExerciseType(word) {
  const gap = findGapBlank(word);
  if (!gap) return { type: 'flashcard', gap: null };
  return { type: Math.random() < 0.5 ? 'gap' : 'flashcard', gap };
}

function renderGapCard(container, word, blank, { onNext }) {
  container.innerHTML = `
    <div class="category">${word.category || ''}</div>
    <p class="exercise-prompt">${blank.before}<strong>___</strong>${blank.after}</p>
    <input type="text" class="gap-input" placeholder="Fehlendes Wort/Wendung eingeben..." />
    <div class="hint-row"><button type="button" class="btn ghost small hint-word-btn">🔤 Gesuchtes Wort auf Deutsch</button></div>
    <div class="hint-slot"></div>
    <div style="margin-top:10px;"><button class="btn ghost check-btn">Prüfen</button></div>
    <div class="feedback-slot"></div>`;
  const input = container.querySelector('.gap-input');
  container.querySelector('.hint-word-btn').addEventListener('click', () => {
    container.querySelector('.hint-slot').innerHTML = `<div class="hint-text">🇩🇪 ${word.translation}</div>`;
  });
  const check = () => {
    if (input.disabled) return;
    const correct = input.value.trim().toLowerCase() === blank.target.trim().toLowerCase();
    input.disabled = true;
    container.querySelector('.check-btn').disabled = true;
    container.querySelector('.feedback-slot').innerHTML = `
      <div class="feedback ${correct ? 'good' : 'bad'}">${correct ? '✓ Richtig!' : `✗ Nicht ganz. Richtige Antwort: "${blank.target.trim()}"`}</div>
      <div style="margin-top:10px;"><button class="btn next-btn">Weiter →</button></div>`;
    container.querySelector('.next-btn').addEventListener('click', () => onNext(correct));
    KeyNav.focusSoon(container.querySelector('.next-btn'));
  };
  container.querySelector('.check-btn').addEventListener('click', check);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  KeyNav.focusSoon(input);
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

  const byCat = {};
  words.forEach(w => { (byCat[w.category || 'Sonstiges'] = byCat[w.category || 'Sonstiges'] || []).push(w); });

  renderHub();

  function renderHub() {
    const s = Store.get();
    const dueCount = w => w.filter(x => SRS.isDue(s.srs[x.id])).length;
    const totalDue = dueCount(words);

    root.innerHTML = `
      <div class="card">
        <h3>Vokabeltrainer</h3>
        <p class="muted">${totalDue > 0 ? `${totalDue} von ${words.length} Vokabeln sitzen aktuell noch nicht.` : `Alle ${words.length} Vokabeln sitzen gerade gut — üben lohnt sich trotzdem!`}</p>
        <button class="btn" id="mix-all">🔀 Alle Kapitel gemischt üben (${words.length})</button>
      </div>
      <div class="card">
        <h3>Kapitel</h3>
        ${Object.entries(byCat).map(([cat, ws]) => {
          const due = dueCount(ws);
          return `
            <div class="chapter-row">
              <div>
                <strong>${cat}</strong>
                <div class="muted" style="font-size:0.8rem;">${ws.length} Wörter${due > 0 ? ` · ${due} sitzen noch nicht` : ''}</div>
              </div>
              <button class="btn ghost small" data-cat="${cat}">Wiederholen →</button>
            </div>`;
        }).join('')}
      </div>`;

    root.querySelector('#mix-all').addEventListener('click', () => renderDirectionChoice(shuffleArray(words), 'Alle Kapitel'));
    root.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => renderDirectionChoice(shuffleArray(byCat[btn.dataset.cat]), btn.dataset.cat));
    });
  }

  function renderDirectionChoice(list, title) {
    const dir = Store.get().vocabDirection || 'en-de';
    root.innerHTML = `
      <div class="card">
        <button class="btn ghost small" id="back-to-hub">← Zurück zur Übersicht</button>
        <h3 style="margin-top:10px;">${title} (${list.length} Karten)</h3>
        <p class="muted">In welche Richtung möchtest du übersetzen?</p>
        <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;">
          <button class="btn ${dir === 'en-de' ? '' : 'ghost'}" id="dir-en-de">Englisch → Deutsch</button>
          <button class="btn ${dir === 'de-en' ? '' : 'ghost'}" id="dir-de-en">Deutsch → Englisch</button>
        </div>
      </div>`;
    root.querySelector('#back-to-hub').addEventListener('click', renderHub);
    root.querySelector('#dir-en-de').addEventListener('click', () => startReview(list, title, 'en-de'));
    root.querySelector('#dir-de-en').addEventListener('click', () => startReview(list, title, 'de-en'));
  }

  function startReview(list, title, direction) {
    Store.update(st => { st.vocabDirection = direction; });
    let idx = 0;
    const wrongWords = [];
    showCard();

    function showCard() {
      const word = list[idx];
      root.innerHTML = `
        <div class="card">
          <div class="module-label">${title} (${idx + 1}/${list.length})</div>
          <div id="flash-slot"></div>
        </div>`;
      const slot = root.querySelector('#flash-slot');
      const onNext = (correct) => {
        SRS.gradeWord(word.id, correct);
        if (!correct) wrongWords.push(word);
        idx++;
        if (idx >= list.length) renderSessionDone();
        else showCard();
      };
      const { type, gap } = pickExerciseType(word);
      if (type === 'gap') renderGapCard(slot, word, gap, { onNext });
      else Flashcard.render(slot, word, { graded: true, reversed: direction === 'de-en', onNext });
    }

    function renderSessionDone() {
      root.innerHTML = `
        <div class="card empty-state">
          <div class="big">🎉</div>
          <h3>Runde abgeschlossen!</h3>
          <p class="muted">Komm jederzeit wieder für die nächste Runde.</p>
        </div>
        ${wrongWords.length > 0 ? `
          <div class="card">
            <h3>Diese ${wrongWords.length} Wörter saßen noch nicht</h3>
            ${wrongWords.map(w => `<div class="example-box"><span class="en"><strong>${w.word}</strong> — ${w.translation}</span></div>`).join('')}
          </div>` : ''}
        <div class="card">
          <h3>Wie geht's weiter?</h3>
          <div style="display:flex; gap:12px; margin-top:10px; flex-wrap:wrap;">
            ${wrongWords.length > 0 ? `<button class="btn" id="retry-wrong">🎯 Nur die ${wrongWords.length} nicht sitzenden üben</button>` : ''}
            <button class="btn ${wrongWords.length > 0 ? 'ghost' : ''}" id="retry-all">🔀 Alle Vokabeln aus allen Kapiteln üben (${words.length})</button>
            <button class="btn ghost" id="back-to-hub2">← Zurück zur Übersicht</button>
          </div>
        </div>`;
      if (wrongWords.length > 0) {
        root.querySelector('#retry-wrong').addEventListener('click', () => startReview(shuffleArray(wrongWords), 'Nicht sitzende Vokabeln', direction));
      }
      root.querySelector('#retry-all').addEventListener('click', () => startReview(shuffleArray(words), 'Alle Kapitel', direction));
      root.querySelector('#back-to-hub2').addEventListener('click', renderHub);
    }
  }
};
