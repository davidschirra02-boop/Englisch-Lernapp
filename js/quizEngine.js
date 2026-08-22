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

const QuizEngine = {
  run(container, items, opts = {}) {
    const total = items.length;
    // opts.initialIdx/initialAnswers erlauben das Fortsetzen einer schon
    // begonnenen Runde (z.B. nach einem Reload) exakt bei der zuletzt
    // offenen Frage samt bisherigen Antworten. Nur vertraut, wenn die
    // Länge zur aktuellen Item-Liste passt (sonst regulärer Neustart).
    const canResume = Array.isArray(opts.initialAnswers) && opts.initialAnswers.length === total;
    const state = canResume
      ? opts.initialAnswers.map(s => ({ ...s }))
      : items.map(() => ({ answered: false, correct: null, chosenIndex: null, chosenText: null, diag: null }));
    let idx = canResume ? Math.min(Math.max(opts.initialIdx || 0, 0), total - 1) : 0;

    function reportProgress() { opts.onProgress?.(idx, state); }

    function scoreCount() { return state.filter(s => s.correct).length; }

    function correctText(item, diag) {
      if (diag) return diag.closest;
      return Array.isArray(item.answer) ? item.answer[0] : (item.answer ?? item.options?.[item.answerIndex]);
    }

    // Baut aus prompt (mit "___"-Lücke) + answer den vollständigen englischen
    // Satz zusammen, zum Vorlesen der Lösung (nur für type:'gap' relevant).
    function resolveGapSentence(item) {
      const ans = Array.isArray(item.answer) ? item.answer[0] : item.answer;
      // Grammatik-Lücken tragen oft einen Verb-Hinweis in Klammern direkt
      // hinter der Lücke (z.B. "I ___ (write) to him..."), der beim
      // Zusammenbauen des vollständigen Satzes mit entfernt werden muss.
      return item.prompt.replace(/_{2,}(\s+_{2,})*(\s*\([^)]*\))?/, ans);
    }

    function wireFeedbackSpeak(item) {
      if (opts.speakable && item.type === 'gap') {
        Speech.wireSpeakButton(container.querySelector('.feedback .speak-btn'), resolveGapSentence(item));
      }
    }

    // Löst den Text auf, der bei falscher Antwort als "Richtige Lösung"
    // vorgelesen wird - bei Lückentexten der ganze rekonstruierte Satz
    // (angenehmer zum Anhören als nur die fehlende Wendung).
    function solutionText(item, diag) {
      return item.type === 'gap' ? resolveGapSentence(item) : correctText(item, diag);
    }

    function wireBubbleSolutionSpeak(item, correct, diag) {
      if (correct || opts.simpleFeedback) return;
      if (item.type !== 'gap' && item.type !== 'translate') return;
      Speech.wireSpeakButton(container.querySelector('.solution-speak-btn'), solutionText(item, diag));
    }

    // Baut die "Bubble"-Kacheln für eine falsche gap/translate-Antwort:
    // Deine Eingabe / Richtige Lösung / Das steckt dahinter / (bei erkanntem
    // Muster oder von Hand verfasstem item.mistakeCoach zusätzlich) Merkregel
    // + Weiteres Beispiel. Prioritätsreihenfolge für die Erklärung:
    // 1. item.mistakeCoach (von Hand kuratierter Inhalt, exakt auf diese
    //    Aufgabe zugeschnitten - aktuell nur für ausgewählte Aufgaben gepflegt)
    // 2. MistakePatterns.detect() (generische, wiederkehrende Fehlerkategorien)
    // 3. bestehende automatische Diff-Erklärung bzw. item.explanation
    // Ohne Treffer aus 1./2. wird nichts dazuerfunden.
    function buildMistakeBubbles(item, diag, chosenText) {
      const solution = solutionText(item, diag);
      const coach = item.mistakeCoach;
      const pattern = !coach ? MistakePatterns.detect(chosenText, solution) : null;
      const fallbackExplain = (diag ? TranslationCheck.describeDiff(diag.ops) : '') || item.explanation || '';
      const explanation = coach ? coach.denkfehler : (pattern ? pattern.explanation : fallbackExplain);
      const ruleBullets = coach ? coach.merkregel : (pattern ? pattern.ruleBullets : null);
      const example = coach ? coach.example : (pattern ? pattern.example : null);
      const title = !coach && pattern ? ` (${pattern.title})` : '';
      const solutionHtml = coach ? coach.correctedHtml : solution;

      const explainHtml = explanation
        ? `<div class="mistake-bubble explain"><div class="bubble-label">💭 Das steckt dahinter${title}</div><div>${explanation}</div></div>`
        : '';
      const ruleHtml = ruleBullets
        ? `<div class="mistake-bubble rule"><div class="bubble-label">💡 Merkregel</div><ul>${ruleBullets.map(b => `<li>${b}</li>`).join('')}</ul></div>`
        : '';
      const exampleHtml = example
        ? `<div class="mistake-bubble example"><div class="bubble-label">📌 Weiteres Beispiel</div><div class="en">${example.en}</div><div class="de">${example.de}</div></div>`
        : '';

      return `
        <div class="mistake-bubble wrong"><div class="bubble-label">❌ Deine Eingabe</div><div>${chosenText || '–'}</div></div>
        <div class="mistake-bubble correct"><div class="bubble-label">✅ Richtige Lösung</div><div style="display:flex; align-items:center; justify-content:space-between; gap:10px;"><span>${solutionHtml}</span><button type="button" class="speak-btn solution-speak-btn" aria-label="Vorlesen" title="Vorlesen">🔊</button></div></div>
        ${explainHtml}${ruleHtml}${exampleHtml}`;
    }

    function feedbackHtml(item, correct, diag, chosenText) {
      const speakHtml = (opts.speakable && item.type === 'gap') ? '<button type="button" class="speak-btn" aria-label="Vorlesen" title="Vorlesen">🔊</button>' : '';
      if (correct && diag && diag.tier === 'close-typo') {
        const typo = TranslationCheck.describeDiff(diag.ops.filter(o => o.type === 'sub'));
        return `<div class="feedback good">✓ Richtig! <span class="feedback-note">(kleiner Tippfehler: ${typo})</span></div>`;
      }
      if (correct) {
        return `<div class="feedback good"><div style="display:flex; align-items:center; justify-content:space-between; gap:10px;"><span>✓ Richtig!</span>${speakHtml}</div></div>`;
      }
      const useBubbles = !opts.simpleFeedback && (item.type === 'gap' || item.type === 'translate');
      if (useBubbles) {
        return `<div class="feedback bad">${buildMistakeBubbles(item, diag, chosenText)}</div>`;
      }
      const explain = item.explanation ? `<div class="feedback-explain">💡 ${item.explanation}</div>` : '';
      const diffLine = diag ? `<div class="feedback-explain">${TranslationCheck.describeDiff(diag.ops)}</div>` : '';
      const text = `✗ Nicht ganz. Richtige Antwort: "${correctText(item, diag)}"`;
      return `<div class="feedback bad"><div style="display:flex; align-items:center; justify-content:space-between; gap:10px;"><span>${text}</span>${speakHtml}</div>${diffLine}${explain}</div>`;
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
      if (btn && idx > 0) btn.addEventListener('click', () => { idx--; reportProgress(); renderItem(); });
    }

    function bindNext(isLast) {
      const btn = container.querySelector('.next-btn');
      btn.addEventListener('click', () => {
        if (isLast) {
          const wrong = items.filter((it, i) => state[i].correct === false);
          opts.onComplete?.(scoreCount(), total, wrong);
        }
        else { idx++; reportProgress(); renderItem(); }
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
           <div style="margin-top:10px; display:flex; align-items:center; gap:10px;"><button class="btn ghost check-btn">Prüfen</button></div>`
        : item.type === 'translate'
        ? `<p class="exercise-prompt">${item.prompt}</p>
           <input type="text" class="gap-input" placeholder="Ganzen Satz auf Englisch eingeben..." />
           ${hintHtml}
           <div style="margin-top:10px; display:flex; align-items:center; gap:10px;"><button class="btn ghost check-btn">Prüfen</button></div>`
        : `<p class="exercise-prompt">${item.prompt}</p>
           <div class="choice-list">
             ${item.options.map((o, i) => `<button class="choice" data-i="${i}">${o}</button>`).join('')}
           </div>`;

      container.innerHTML = `${topline()}${bodyHtml}<div class="feedback-slot"></div><div class="next-slot" style="margin-top:14px;"></div>`;
      bindBack();

      function finalize(correct, chosenIndex, chosenText, diag) {
        state[idx] = { answered: true, correct, chosenIndex, chosenText, diag: diag || null };
        reportProgress();
        container.querySelector('.feedback-slot').innerHTML = feedbackHtml(item, correct, diag, chosenText);
        wireFeedbackSpeak(item);
        wireBubbleSolutionSpeak(item, correct, diag);
        container.querySelector('.next-slot').innerHTML = `<button class="btn next-btn">${isLast ? 'Fertig' : 'Weiter'} →</button>`;
        bindNext(isLast);
      }

      if (item.type === 'gap' || item.type === 'translate') {
        const input = container.querySelector('.gap-input');
        const check = () => {
          let correct, diag;
          if (item.type === 'translate') {
            diag = TranslationCheck.classify(input.value, item);
            correct = diag.tier !== 'wrong';
          } else {
            const val = input.value.trim().toLowerCase();
            const accepted = (Array.isArray(item.answer) ? item.answer : [item.answer]).map(a => a.toLowerCase());
            correct = accepted.includes(val);
            if (!correct) diag = TranslationCheck.classify(input.value, item);
          }
          input.disabled = true;
          container.querySelector('.check-btn').disabled = true;
          finalize(correct, null, input.value.trim(), diag);
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
        ${feedbackHtml(item, st.correct, st.diag, st.chosenText)}
        <div class="next-slot" style="margin-top:14px;"><button class="btn next-btn">${isLast ? 'Fertig' : 'Weiter'} →</button></div>
      `;
      bindBack();
      wireFeedbackSpeak(item);
      wireBubbleSolutionSpeak(item, st.correct, st.diag);
      bindNext(isLast);
    }

    renderItem();
  }
};
