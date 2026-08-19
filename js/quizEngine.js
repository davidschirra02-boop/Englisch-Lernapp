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

// Ermittelt anhand des gesprochenen Satzes, welche Options-Schaltfläche am
// besten passt (per TranslationCheck.classify, das schon Tippfehler-Toleranz
// mitbringt). Enthält der Fragesatz eine Lücke, wird sowohl gegen den
// kompletten Satz mit eingesetzter Option ALS AUCH gegen die reine Option
// allein geprüft - Menschen sagen bei Multiple-Choice oft nur die Antwort
// selbst, nicht zwingend den ganzen Satz, und beides soll zählen. Liefert
// -1, wenn keine Option nahe genug dran ist.
function matchSpokenChoice(item, transcript) {
  const hasBlank = item.prompt.includes('___');
  const tierRank = { wrong: 0, 'close-typo': 1, exact: 2 };
  let bestIdx = -1, bestTier = 'wrong';
  item.options.forEach((opt, i) => {
    // " '" (Leerzeichen vor Kontraktions-Apostroph, z.B. "I ___" + "'ve had"
    // -> "I 've had") auf "I've had" zusammenziehen, sonst zerlegt die
    // Tokenisierung "'ve" fälschlich in ein eigenes Wort und der Vergleich
    // scheitert an einer reinen Leerzeichen-Fuge, nicht am Inhalt.
    const candidates = hasBlank ? [item.prompt.replace('___', opt).replace(/ '/g, "'"), opt] : [opt];
    candidates.forEach(candidate => {
      const diag = TranslationCheck.classify(transcript, { answer: [candidate] });
      if (tierRank[diag.tier] > tierRank[bestTier]) { bestTier = diag.tier; bestIdx = i; }
    });
  });
  return bestIdx;
}

// Startet automatisch (ohne Antippen) ein Zuhören, aber nur wenn das
// Mikrofon auf diesem Gerät schon erlaubt ist - sonst würde bei jeder neuen
// Frage ungefragt ein Berechtigungsdialog aufpoppen.
function autoListenIfGranted(startFn) {
  if (!SpeechInput.supported() || !navigator.permissions?.query) return;
  navigator.permissions.query({ name: 'microphone' }).then(status => {
    if (status.state === 'granted') startFn();
  }).catch(() => {});
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

    function feedbackHtml(item, correct, diag) {
      const explain = (!correct && item.explanation) ? `<div class="feedback-explain">💡 ${item.explanation}</div>` : '';
      if (diag && diag.tier === 'close-typo') {
        const typo = TranslationCheck.describeDiff(diag.ops.filter(o => o.type === 'sub'));
        return `<div class="feedback good">✓ Richtig! <span class="feedback-note">(kleiner Tippfehler: ${typo})</span></div>`;
      }
      const diffLine = (!correct && diag) ? `<div class="feedback-explain">${TranslationCheck.describeDiff(diag.ops)}</div>` : '';
      const text = correct ? '✓ Richtig!' : `✗ Nicht ganz. Richtige Antwort: "${correctText(item, diag)}"`;
      return `<div class="feedback ${correct ? 'good' : 'bad'}">${text}${diffLine}${explain}</div>`;
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
      if (btn && idx > 0) btn.addEventListener('click', () => { SpeechInput.stop(); idx--; reportProgress(); renderItem(); });
    }

    function bindNext(isLast) {
      const btn = container.querySelector('.next-btn');
      btn.addEventListener('click', () => {
        SpeechInput.stop();
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

      const micBtnHtml = SpeechInput.supported()
        ? `<button type="button" class="speak-btn mic-btn" title="Antwort sprechen">🎤</button><span class="mic-status muted" style="font-size:0.8rem;"></span>`
        : '';
      const choiceMicHtml = SpeechInput.supported()
        ? `<div style="margin-bottom:10px; display:flex; align-items:center; gap:10px;"><button type="button" class="btn ghost small mic-btn">🎤 Antwort sprechen</button><span class="mic-status muted" style="font-size:0.8rem;"></span></div>`
        : '';

      const bodyHtml = item.type === 'gap'
        ? `<p class="exercise-prompt">${item.prompt}</p>
           <input type="text" class="gap-input" placeholder="Antwort eingeben..." />
           ${hintHtml}
           <div style="margin-top:10px; display:flex; align-items:center; gap:10px;"><button class="btn ghost check-btn">Prüfen</button>${micBtnHtml}</div>`
        : item.type === 'translate'
        ? `<p class="exercise-prompt">${item.prompt}</p>
           <input type="text" class="gap-input" placeholder="Ganzen Satz auf Englisch eingeben..." />
           ${hintHtml}
           <div style="margin-top:10px; display:flex; align-items:center; gap:10px;"><button class="btn ghost check-btn">Prüfen</button>${micBtnHtml}</div>`
        : `<p class="exercise-prompt">${item.prompt}</p>
           ${choiceMicHtml}
           <div class="choice-list">
             ${item.options.map((o, i) => `<button class="choice" data-i="${i}">${o}</button>`).join('')}
           </div>`;

      container.innerHTML = `${topline()}${bodyHtml}<div class="feedback-slot"></div><div class="next-slot" style="margin-top:14px;"></div>`;
      bindBack();

      function finalize(correct, chosenIndex, chosenText, diag) {
        state[idx] = { answered: true, correct, chosenIndex, chosenText, diag: diag || null };
        reportProgress();
        container.querySelector('.feedback-slot').innerHTML = feedbackHtml(item, correct, diag);
        container.querySelector('.next-slot').innerHTML = `<button class="btn next-btn">${isLast ? 'Fertig' : 'Weiter'} →</button>`;
        bindNext(isLast);
        // Sprachbefehl "weiter"/"next" als Alternative zum Klick - nur wenn das
        // Mikrofon schon erlaubt ist, damit hier nie ungefragt ein
        // Berechtigungsdialog aufpoppt (der Button bleibt immer nutzbar).
        SpeechInput.listenIfGranted({
          onResult: (t) => {
            const norm = t.trim().toLowerCase();
            if (norm.includes('weiter') || norm.includes('next')) container.querySelector('.next-btn')?.click();
          }
        });
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
          }
          input.disabled = true;
          container.querySelector('.check-btn').disabled = true;
          finalize(correct, null, input.value.trim(), diag);
        };
        container.querySelector('.check-btn').addEventListener('click', check);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        const micBtn = container.querySelector('.mic-btn');
        const micStatus = container.querySelector('.mic-status');
        const startListening = () => {
          micBtn.classList.add('listening');
          micStatus.textContent = 'Höre zu …';
          SpeechInput.listen({
            onResult: (t) => { input.value = t; check(); },
            onError: (err) => { micStatus.textContent = SpeechInput.errorText(err); },
            onEnd: () => { micBtn.classList.remove('listening'); micStatus.textContent = ''; }
          });
        };
        micBtn?.addEventListener('click', startListening);
        if (micBtn) autoListenIfGranted(startListening);
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
        const micBtn = container.querySelector('.mic-btn');
        const micStatus = container.querySelector('.mic-status');
        const startListening = () => {
          micBtn.classList.add('listening');
          micStatus.textContent = 'Höre zu …';
          SpeechInput.listen({
            onResult: (t) => {
              micStatus.textContent = '';
              const i = matchSpokenChoice(item, t);
              if (i === -1) { micStatus.textContent = `Nicht eindeutig verstanden ("${t}") – nochmal sprechen oder antippen.`; return; }
              choiceButtons[i].click();
              container.querySelector('.feedback-slot')?.insertAdjacentHTML('beforeend', `<p class="muted" style="font-size:0.8rem;">🎤 Verstanden: „${t}"</p>`);
            },
            onError: (err) => { micStatus.textContent = SpeechInput.errorText(err); },
            onEnd: () => { micBtn.classList.remove('listening'); }
          });
        };
        micBtn?.addEventListener('click', startListening);
        if (micBtn) autoListenIfGranted(startListening);
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
        ${feedbackHtml(item, st.correct, st.diag)}
        <div class="next-slot" style="margin-top:14px;"><button class="btn next-btn">${isLast ? 'Fertig' : 'Weiter'} →</button></div>
      `;
      bindBack();
      bindNext(isLast);
    }

    renderItem();
  }
};
