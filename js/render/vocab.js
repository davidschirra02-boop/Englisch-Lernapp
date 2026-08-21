/* Vokabeltrainer: Übersicht ("Hub") mit allen Kapiteln (= Vokabel-Kategorien,
   entsprechen den Wochenthemen). Von dort aus wählt man ein Kapitel, "alle
   gemischt" oder — sofern Vokabeln fällig sind — gezielt nur die aktuell
   nicht sitzenden Vokabeln über alle Kapitel hinweg, dann die Übungsart
   (Karteikarten / Lückentext / Gemischt) und zuletzt die Abfragerichtung
   (Englisch → Deutsch / Deutsch → Englisch). Übungen sind jederzeit
   wiederholbar, nicht nur wenn Karten laut SRS fällig sind — der
   Fällig-Status wird zusätzlich als Hinweis pro Kapitel angezeigt. Am Ende
   einer Runde werden falsch bewertete Wörter noch einmal aufgelistet, plus
   die Wahl, direkt nur diese oder wieder alle Vokabeln aus allen Kapiteln
   zu üben.

   Übungsarten: klassische Flashcard (umdrehen + selbst einschätzen) oder
   Lückentext (die Wendung im Beispielsatz ergänzen, falls sie dort wörtlich
   vorkommt; das deutsche Wort ist als Hilfestellung per Klick auf einen
   Hinweis-Button einblendbar, nicht automatisch sichtbar). Im Modus "Nur
   Lückentext" werden Wörter ohne wörtlichen Treffer im Beispielsatz von
   vornherein aus der Liste entfernt, statt sie als Flashcard unterzumogeln
   - wer "nur Lückentext" wählt, soll auch wirklich nur Lückentexte sehen.
   Im Modus "Gemischt" wird pro Karte zufällig zwischen beiden Übungsarten
   gewählt (dort bleibt der Flashcard-Fallback für Wörter ohne Treffer). */

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

function pickExerciseType(word, mode) {
  if (mode === 'flashcard') return { type: 'flashcard', gap: null };
  const gap = findGapBlank(word);
  if (mode === 'gap') return { type: 'gap', gap }; // Liste ist für diesen Modus schon auf Treffer gefiltert
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
    const dueOf = w => w.filter(x => SRS.isDue(s.srs[x.id]));
    const dueWords = dueOf(words);
    const totalDue = dueWords.length;

    root.innerHTML = `
      <div class="card">
        <h3>Vokabeltrainer</h3>
        <p class="muted">${totalDue > 0 ? `${totalDue} von ${words.length} Vokabeln sitzen aktuell noch nicht.` : `Alle ${words.length} Vokabeln sitzen gerade gut — üben lohnt sich trotzdem!`}</p>
        <div style="display:flex; gap:12px; margin-top:10px; flex-wrap:wrap;">
          ${totalDue > 0 ? `<button class="btn ghost" id="review-due">🎯 Nur die ${totalDue} nicht sitzenden üben</button>` : ''}
          <button class="btn ghost" id="mix-all">🔀 Alle Kapitel gemischt üben (${words.length})</button>
        </div>
      </div>
      <div class="card">
        <h3>Kapitel</h3>
        <p class="muted" style="font-size:0.8rem;">Mehrere Kapitel anhaken, um sie zusammen zu üben.</p>
        ${Object.entries(byCat).map(([cat, ws]) => {
          const due = dueOf(ws).length;
          return `
            <div class="chapter-row">
              <label style="display:flex; align-items:center;">
                <input type="checkbox" class="chapter-select" data-cat="${cat}">
              </label>
              <div style="flex:1;">
                <strong>${cat}</strong>
                <div class="muted" style="font-size:0.8rem;">${ws.length} Wörter${due > 0 ? ` · ${due} sitzen noch nicht` : ''}</div>
              </div>
              <button class="btn ghost small" data-cat="${cat}">Wiederholen →</button>
            </div>`;
        }).join('')}
        <div id="chapter-multi-bar" style="display:none; align-items:center; gap:12px; margin-top:14px; padding-top:14px; border-top:1px solid var(--line); flex-wrap:wrap;">
          <span class="muted" id="chapter-multi-count"></span>
          <button class="btn ghost" id="review-selected">Ausgewählte Kapitel zusammen üben →</button>
        </div>
      </div>`;

    if (totalDue > 0) {
      root.querySelector('#review-due').addEventListener('click', () => renderModeChoice(shuffleArray(dueWords), 'Nicht sitzende Vokabeln'));
    }
    root.querySelector('#mix-all').addEventListener('click', () => renderModeChoice(shuffleArray(words), 'Alle Kapitel'));
    root.querySelectorAll('button[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => renderModeChoice(shuffleArray(byCat[btn.dataset.cat]), btn.dataset.cat));
    });

    const selectedCats = new Set();
    const multiBar = root.querySelector('#chapter-multi-bar');
    const multiCount = root.querySelector('#chapter-multi-count');
    const updateMultiBar = () => {
      const n = selectedCats.size;
      multiBar.style.display = n > 0 ? 'flex' : 'none';
      multiCount.textContent = `${n} Kapitel ausgewählt`;
    };
    root.querySelectorAll('.chapter-select').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) selectedCats.add(cb.dataset.cat);
        else selectedCats.delete(cb.dataset.cat);
        updateMultiBar();
      });
    });
    root.querySelector('#review-selected').addEventListener('click', () => {
      const cats = [...selectedCats];
      const list = cats.flatMap(c => byCat[c]);
      const title = cats.length <= 3 ? cats.join(' + ') : `${cats.length} Kapitel`;
      renderModeChoice(shuffleArray(list), title);
    });
  }

  function renderModeChoice(list, title) {
    const gapCount = list.filter(w => findGapBlank(w)).length;
    root.innerHTML = `
      <div class="card">
        <button class="btn ghost small" id="back-to-hub">← Zurück zur Übersicht</button>
        <h3 style="margin-top:10px;">${title} (${list.length} Karten)</h3>
        <p class="muted">Welche Übungsart möchtest du üben?</p>
        <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;">
          <button class="btn ghost" id="mode-flashcard">Karteikarten</button>
          <button class="btn ghost" id="mode-gap" ${gapCount === 0 ? 'disabled' : ''}>Lückentext (${gapCount})</button>
          <button class="btn ghost" id="mode-mixed">Gemischt</button>
        </div>
      </div>`;
    root.querySelector('#back-to-hub').addEventListener('click', renderHub);
    root.querySelector('#mode-flashcard').addEventListener('click', () => renderDirectionChoice(list, title, 'flashcard'));
    root.querySelector('#mode-gap').addEventListener('click', () => renderDirectionChoice(list.filter(w => findGapBlank(w)), title, 'gap'));
    root.querySelector('#mode-mixed').addEventListener('click', () => renderDirectionChoice(list, title, 'mixed'));
  }

  function renderDirectionChoice(list, title, mode) {
    root.innerHTML = `
      <div class="card">
        <button class="btn ghost small" id="back-to-mode">← Zurück</button>
        <h3 style="margin-top:10px;">${title} (${list.length} Karten)</h3>
        <p class="muted">In welche Richtung möchtest du übersetzen?</p>
        <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;">
          <button class="btn ghost" id="dir-en-de">Englisch → Deutsch</button>
          <button class="btn ghost" id="dir-de-en">Deutsch → Englisch</button>
        </div>
      </div>`;
    root.querySelector('#back-to-mode').addEventListener('click', () => renderModeChoice(list, title));
    root.querySelector('#dir-en-de').addEventListener('click', () => startReview(list, title, 'en-de', mode));
    root.querySelector('#dir-de-en').addEventListener('click', () => startReview(list, title, 'de-en', mode));
  }

  function startReview(list, title, direction, mode) {
    Store.update(st => { st.vocabDirection = direction; st.vocabMode = mode; });
    // Sicherheitsnetz: "retry-all"/"retry-wrong" am Rundenende reichen ggf.
    // eine noch ungefilterte Liste durch - im "Nur Lückentext"-Modus darf
    // trotzdem nie ein Wort ohne Treffer im Beispielsatz durchrutschen.
    if (mode === 'gap') list = list.filter(w => findGapBlank(w));
    if (list.length === 0) {
      root.innerHTML = `
        <div class="card empty-state">
          <p class="muted">Für diese Auswahl gibt es keine Lückentext-Vokabeln.</p>
          <button class="btn ghost" id="back-to-hub3">← Zurück zur Übersicht</button>
        </div>`;
      root.querySelector('#back-to-hub3').addEventListener('click', renderHub);
      return;
    }
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
      const { type, gap } = pickExerciseType(word, mode);
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
            ${wrongWords.length > 0 ? `<button class="btn ghost" id="retry-wrong">🎯 Nur die ${wrongWords.length} nicht sitzenden üben</button>` : ''}
            <button class="btn ghost" id="retry-all">🔀 Alle Vokabeln aus allen Kapiteln üben (${words.length})</button>
            <button class="btn ghost" id="back-to-hub2">← Zurück zur Übersicht</button>
          </div>
        </div>`;
      if (wrongWords.length > 0) {
        root.querySelector('#retry-wrong').addEventListener('click', () => startReview(shuffleArray(wrongWords), 'Nicht sitzende Vokabeln', direction, mode));
      }
      root.querySelector('#retry-all').addEventListener('click', () => startReview(shuffleArray(words), 'Alle Kapitel', direction, mode));
      root.querySelector('#back-to-hub2').addEventListener('click', renderHub);
    }
  }
};
