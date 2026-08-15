/* Generischer Frage-Runner für Choice- und Gap-Fill-Items.
   Wird von Grammatik-Übungen, Wortschatz-Vertiefung, Hörverständnis und
   Quiz-Blöcken genutzt. Unterstützt Zurück-Navigation zu bereits
   beantworteten Fragen (schreibgeschützte Review-Ansicht).

   Tastatur: Pfeiltasten bewegen den Fokus (siehe keynav.js), Enter aktiviert
   den fokussierten Button nativ. Nach jeder Aktion wird der sinnvolle
   nächste Button automatisch fokussiert, damit Enter allein durch die
   Übung führt. */

/* Ordnet Items so um, dass zwei Items mit demselben `topic` (z. B. dasselbe
   abgefragte Wort/derselbe Grammatikpunkt) nie direkt aufeinanderfolgen —
   auch nach einer zufälligen Mischung (siehe js/render/grammar.js). Items
   ohne `topic`-Feld bekommen intern einen eindeutigen Schlüssel und blockieren
   daher nie etwas (rückwärtskompatibel zu älterem Content ohne dieses Feld).
   Greedy "größte Gruppe zuerst"-Verfahren (wie beim Reorganize-String-
   Problem): findet immer eine gültige Reihenfolge, wenn rechnerisch möglich
   (keine Gruppe > die Hälfte aller Items); sonst minimale Restkollisionen. */
function spaceOutTopics(items) {
  const groups = new Map();
  items.forEach((it, i) => {
    const key = it.topic || `__free_${i}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(it);
  });
  const queues = Array.from(groups.values());
  const result = [];
  let lastQueue = null;
  while (result.length < items.length) {
    queues.sort((a, b) => b.length - a.length);
    let queue = queues.find(q => q.length > 0 && q !== lastQueue) || queues.find(q => q.length > 0);
    result.push(queue.shift());
    lastQueue = queue;
  }
  return result;
}

/* Toleranter Vergleich für ganze Satzübersetzungen (type: 'translate'):
   Groß-/Kleinschreibung, Satzzeichen am Ende und doppelte Leerzeichen
   spielen keine Rolle — der Satzbau/die Wortwahl davor muss aber stimmen. */
function normalizeSentence(s) {
  return s.trim().toLowerCase().replace(/[.!?]+$/, '').replace(/\s+/g, ' ');
}

const QuizEngine = {
  run(container, items, opts = {}) {
    const total = items.length;
    const state = items.map(() => ({ answered: false, correct: null, chosenIndex: null, chosenText: null }));
    let idx = 0;

    function scoreCount() { return state.filter(s => s.correct).length; }

    function correctText(item) {
      return Array.isArray(item.answer) ? item.answer[0] : (item.answer ?? item.options?.[item.answerIndex]);
    }

    function feedbackHtml(item, correct) {
      const explain = (!correct && item.explanation) ? `<div class="feedback-explain">💡 ${item.explanation}</div>` : '';
      const text = correct ? '✓ Richtig!' : `✗ Nicht ganz. Richtige Antwort: "${correctText(item)}"`;
      return `<div class="feedback ${correct ? 'good' : 'bad'}">${text}${explain}</div>`;
    }

    function topline() {
      return `
        <div class="quiz-topline">
          <span class="muted" style="font-size:0.8rem;">Frage ${idx + 1} / ${total}</span>
          <button class="btn ghost small nav-back-btn" ${idx === 0 ? 'disabled' : ''}>← Zurück</button>
        </div>`;
    }

    function bindBack() {
      const btn = container.querySelector('.nav-back-btn');
      if (btn && idx > 0) btn.addEventListener('click', () => { idx--; renderItem(); });
    }

    function bindNext(isLast) {
      const btn = container.querySelector('.next-btn');
      btn.addEventListener('click', () => {
        if (isLast) {
          const wrong = items.filter((it, i) => state[i].correct === false);
          opts.onComplete?.(scoreCount(), total, wrong);
        }
        else { idx++; renderItem(); }
      });
      KeyNav.focusSoon(btn);
    }

    function renderItem() {
      const item = items[idx];
      const st = state[idx];
      st.answered ? renderReviewed(item, st) : renderFresh(item);
    }

    function renderFresh(item) {
      const isLast = idx === total - 1;
      const hintButtons = [];
      if (item.hintWord) hintButtons.push('<button type="button" class="btn ghost small hint-word-btn">🔤 Nur das gesuchte Wort (Deutsch)</button>');
      if (item.hintSentence) hintButtons.push('<button type="button" class="btn ghost small hint-sentence-btn">📝 Ganzen Satz übersetzen</button>');
      if (item.hintTargetWord) hintButtons.push('<button type="button" class="btn ghost small hint-target-btn">🔤 Gesuchtes Wort (Englisch)</button>');
      const hintHtml = hintButtons.length ? `<div class="hint-row">${hintButtons.join('')}</div><div class="hint-slot"></div>` : '';

      const bodyHtml = item.type === 'gap'
        ? `<p class="exercise-prompt">${item.prompt}</p>
           <input type="text" class="gap-input" placeholder="Antwort eingeben..." />
           ${hintHtml}
           <div style="margin-top:10px;"><button class="btn ghost check-btn">Prüfen</button></div>`
        : item.type === 'translate'
        ? `<p class="exercise-prompt">${item.prompt}</p>
           <input type="text" class="gap-input" placeholder="Ganzen Satz auf Englisch eingeben..." />
           ${hintHtml}
           <div style="margin-top:10px;"><button class="btn ghost check-btn">Prüfen</button></div>`
        : `<p class="exercise-prompt">${item.prompt}</p>
           <div class="choice-list">
             ${item.options.map((o, i) => `<button class="choice" data-i="${i}">${o}</button>`).join('')}
           </div>`;

      container.innerHTML = `${topline()}${bodyHtml}<div class="feedback-slot"></div><div class="next-slot" style="margin-top:14px;"></div>`;
      bindBack();

      function finalize(correct, chosenIndex, chosenText) {
        state[idx] = { answered: true, correct, chosenIndex, chosenText };
        container.querySelector('.feedback-slot').innerHTML = feedbackHtml(item, correct);
        container.querySelector('.next-slot').innerHTML = `<button class="btn next-btn">${isLast ? 'Fertig' : 'Weiter'} →</button>`;
        bindNext(isLast);
      }

      if (item.type === 'gap' || item.type === 'translate') {
        const input = container.querySelector('.gap-input');
        const check = () => {
          let correct;
          if (item.type === 'translate') {
            const val = normalizeSentence(input.value);
            const accepted = (Array.isArray(item.answer) ? item.answer : [item.answer]).map(normalizeSentence);
            correct = accepted.includes(val);
          } else {
            const val = input.value.trim().toLowerCase();
            const accepted = (Array.isArray(item.answer) ? item.answer : [item.answer]).map(a => a.toLowerCase());
            correct = accepted.includes(val);
          }
          input.disabled = true;
          container.querySelector('.check-btn').disabled = true;
          finalize(correct, null, input.value.trim());
        };
        container.querySelector('.check-btn').addEventListener('click', check);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        const hintSlot = container.querySelector('.hint-slot');
        container.querySelector('.hint-word-btn')?.addEventListener('click', () => {
          hintSlot.innerHTML = `<div class="hint-text">🇩🇪 ${item.hintWord}</div>`;
        });
        container.querySelector('.hint-sentence-btn')?.addEventListener('click', () => {
          hintSlot.innerHTML = `<div class="hint-text">🇩🇪 ${item.hintSentence}</div>`;
        });
        container.querySelector('.hint-target-btn')?.addEventListener('click', () => {
          hintSlot.innerHTML = `<div class="hint-text">🇬🇧 ${item.hintTargetWord}</div>`;
        });
        KeyNav.focusSoon(input);
      } else {
        const choiceButtons = Array.from(container.querySelectorAll('.choice'));
        choiceButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            const i = Number(btn.dataset.i);
            const correct = i === item.answerIndex;
            choiceButtons.forEach(b => b.disabled = true);
            btn.classList.add(correct ? 'correct' : 'incorrect');
            if (!correct) container.querySelector(`.choice[data-i="${item.answerIndex}"]`)?.classList.add('correct');
            finalize(correct, i, item.options[i]);
          });
        });
        KeyNav.focusSoon(choiceButtons[0]);
      }
    }

    function renderReviewed(item, st) {
      const isLast = idx === total - 1;
      const bodyHtml = (item.type === 'gap' || item.type === 'translate')
        ? `<p class="exercise-prompt">${item.prompt}</p><input type="text" class="gap-input" value="${st.chosenText || ''}" disabled />`
        : `<p class="exercise-prompt">${item.prompt}</p>
           <div class="choice-list">
             ${item.options.map((o, i) => {
               const cls = i === item.answerIndex ? 'correct' : (i === st.chosenIndex ? 'incorrect' : '');
               return `<button class="choice ${cls}" disabled>${o}</button>`;
             }).join('')}
           </div>`;

      container.innerHTML = `
        ${topline()}
        ${bodyHtml}
        ${feedbackHtml(item, st.correct)}
        <div class="next-slot" style="margin-top:14px;"><button class="btn next-btn">${isLast ? 'Fertig' : 'Weiter'} →</button></div>
      `;
      bindBack();
      bindNext(isLast);
    }

    renderItem();
  }
};
