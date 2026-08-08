/* Tagesansicht: führt sequenziell durch Grammatik → Vokabeln → Hören →
   Konversation → Quiz (bzw. Review → Quiz an Tag 7 jeder Woche). */

const STEP_LABELS = {
  grammar: 'Grammatik',
  vocab: 'Wortschatz',
  vocabPractice: 'Wortschatz-Vertiefung',
  listening: 'Hörverständnis',
  conversation: 'Konversation',
  quiz: 'Quiz',
  review: 'Wochen-Review'
};

Render.lesson = function (root, day) {
  const meta = getDayMeta(day);
  if (!meta) {
    root.innerHTML = `<div class="empty-state"><div class="big">🤔</div><p>Diesen Tag gibt es nicht.</p><button class="btn ghost" onclick="goto('#/dashboard')">Zurück zum Dashboard</button></div>`;
    return;
  }

  const dc = getDayContent(day);
  if (!dc) {
    root.innerHTML = `
      <div class="card empty-state">
        <div class="big">🌱</div>
        <h3>${meta.title}</h3>
        <p>Diese Lektion wird bald ergänzt. Schau in ein paar Tagen wieder vorbei!</p>
        <button class="btn ghost" onclick="goto('#/dashboard')">Zurück zum Dashboard</button>
      </div>`;
    return;
  }

  const { content } = dc;
  const isReview = !!content.review;
  const stepNames = isReview ? ['review', 'quiz'] : ['grammar', 'vocab', 'vocabPractice', 'listening', 'conversation', 'quiz'];
  let stepIdx = Math.min(Store.getLessonStep(day), stepNames.length - 1);
  let quizScore = 0, quizTotal = 0;
  let missedItems = [];

  function shell(innerHtml, labelOverride) {
    root.innerHTML = `
      <div class="card">
        <div class="step-track">
          ${stepNames.map((s, i) => `<div class="seg ${i < stepIdx ? 'filled' : ''} ${i === stepIdx ? 'active' : ''}"></div>`).join('')}
        </div>
        <div class="module-label">${labelOverride || STEP_LABELS[stepNames[stepIdx]]}</div>
        ${innerHtml}
      </div>`;
  }

  function next() {
    stepIdx++;
    Store.saveLessonStep(day, stepIdx);
    renderStep();
  }

  function renderStep() {
    const step = stepNames[stepIdx];
    if (step === 'grammar') renderGrammar();
    else if (step === 'vocab') renderVocabIntro();
    else if (step === 'vocabPractice') renderVocabPractice();
    else if (step === 'listening') renderListening();
    else if (step === 'conversation') renderConversationStep();
    else if (step === 'review') renderReview();
    else renderQuiz();
  }

  function renderGrammar() {
    const g = content.grammar;
    shell(`
      <h2>${g.ruleTitle}</h2>
      <p>${g.explanation}</p>
      ${g.examples.map(ex => `<div class="example-box"><div class="en">${ex.en}</div><div class="de">${ex.de}</div></div>`).join('')}
      <p class="muted" style="margin-top:14px;"><strong>Vergleich mit Deutsch:</strong> ${g.contrast}</p>
      <div class="exercise" id="ex-slot"></div>
    `);
    QuizEngine.run(root.querySelector('#ex-slot'), g.exercises, {
      onComplete: (score, total, wrong) => { missedItems.push(...wrong); next(); }
    });
  }

  function renderVocabIntro() {
    const words = content.vocabulary;
    let idx = 0;
    function showWord() {
      shell(`
        <div class="quiz-topline">
          <span class="muted" style="font-size:0.8rem;">Karte ${idx + 1} / ${words.length}</span>
          <button class="btn ghost small vocab-back-btn" ${idx === 0 ? 'disabled' : ''}>← Zurück</button>
        </div>
        <h2>Neue Wörter</h2><p class="muted">Karte antippen zum Umdrehen</p><div id="flash-slot"></div>`);
      const backBtn = root.querySelector('.vocab-back-btn');
      if (backBtn && idx > 0) backBtn.addEventListener('click', () => { idx--; showWord(); });
      Flashcard.render(root.querySelector('#flash-slot'), words[idx], {
        graded: false,
        onNext: () => { idx++; if (idx >= words.length) next(); else showWord(); }
      });
    }
    showWord();
  }

  function renderVocabPractice() {
    shell(`<h2>Wortschatz-Vertiefung</h2><p class="muted">Festigen wir die neuen Wörter mit ein paar Übungen.</p><div id="practice-slot"></div>`);
    QuizEngine.run(root.querySelector('#practice-slot'), content.vocabPractice, {
      onComplete: (score, total, wrong) => { missedItems.push(...wrong); next(); }
    });
  }

  function renderListening() {
    const l = content.listening;
    shell(`
      <h2>${l.title}</h2>
      <p class="muted">Klicke auf 🔊, oder nutze ↓/↑ zum Wechseln und Enter zum Abspielen.</p>
      <div id="story-lines"></div>
      <div id="listen-quiz-slot" style="margin-top:18px;"><button class="btn ghost" id="to-quiz">Weiter zu den Verständnisfragen →</button></div>
    `);
    const linesEl = root.querySelector('#story-lines');
    linesEl.innerHTML = l.sentences.map((s, i) => `<div class="story-line" data-i="${i}"><button class="speak-btn" data-i="${i}">🔊</button><span>${s}</span></div>`).join('');

    let focusIdx = 0;
    function highlight() {
      linesEl.querySelectorAll('.story-line').forEach(el => el.classList.toggle('focused', Number(el.dataset.i) === focusIdx));
    }
    function speakLine(i) {
      linesEl.querySelectorAll('.speak-btn').forEach(b => b.classList.remove('speaking'));
      const btn = linesEl.querySelector(`.speak-btn[data-i="${i}"]`);
      btn.classList.add('speaking');
      Speech.speak(l.sentences[i], { onEnd: () => btn.classList.remove('speaking') });
    }
    linesEl.querySelectorAll('.speak-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        focusIdx = Number(btn.dataset.i);
        highlight();
        speakLine(focusIdx);
      });
    });
    linesEl.tabIndex = 0;
    linesEl.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); focusIdx = Math.min(focusIdx + 1, l.sentences.length - 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusIdx = Math.max(focusIdx - 1, 0); highlight(); }
      else if (e.key === 'Enter') { e.preventDefault(); speakLine(focusIdx); }
    });
    highlight();
    linesEl.focus();

    root.querySelector('#to-quiz').addEventListener('click', () => {
      const slot = root.querySelector('#listen-quiz-slot');
      slot.innerHTML = '';
      QuizEngine.run(slot, l.questions, {
        onComplete: (score, total, wrong) => { missedItems.push(...wrong); next(); }
      });
    });
  }

  function renderConversationStep() {
    shell(`<h2>Konversationstrainer</h2><div id="conv-slot"></div>`);
    RenderConversation.run(root.querySelector('#conv-slot'), content.conversation, next);
  }

  function renderReview() {
    const r = content.summary;
    shell(`
      <h2>Wochen-Review</h2>
      <p>${r.intro}</p>
      <ul>${r.grammarPoints.map(p => `<li style="margin-bottom:6px;">${p}</li>`).join('')}</ul>
      <p class="muted">${r.encouragement}</p>
      <button class="btn" id="review-continue">Weiter zum Quiz →</button>
    `);
    root.querySelector('#review-continue').addEventListener('click', next);
  }

  function renderQuiz() {
    shell(`<h2>Abschluss-Quiz</h2><div id="quiz-slot"></div>`);
    QuizEngine.run(root.querySelector('#quiz-slot'), content.quiz, {
      onComplete: (score, total, wrong) => {
        quizScore = score; quizTotal = total;
        missedItems.push(...wrong);
        proceedAfterQuiz();
      }
    });
  }

  function proceedAfterQuiz() {
    if (missedItems.length > 0) renderMissedReview(finishLesson);
    else finishLesson();
  }

  function renderMissedReview(onDone) {
    const toReview = missedItems;
    missedItems = [];
    shell(`
      <h2>Wiederholung</h2>
      <p class="muted">Diese Fragen hattest du falsch — beantworte sie noch einmal richtig, bevor es weitergeht.</p>
      <div id="review-slot"></div>
    `, 'Wiederholung');
    QuizEngine.run(root.querySelector('#review-slot'), toReview, {
      onComplete: (score, total, wrong) => {
        missedItems.push(...wrong);
        if (missedItems.length > 0) renderMissedReview(onDone);
        else onDone();
      }
    });
  }

  function finishLesson() {
    if (!isReview) ensureWordsInSRS(day);
    Store.markDayComplete(day, quizScore, quizTotal);
    Store.clearLessonProgress();
    renderDone();
  }

  function renderDone() {
    root.innerHTML = `
      <div class="card">
        <footer class="done-banner">
          <div class="big">🎉</div>
          <h2>Tag ${day} abgeschlossen!</h2>
          <p class="muted">Quiz-Ergebnis: ${quizScore} / ${quizTotal}</p>
          <button class="btn" id="to-dashboard">Zum Dashboard →</button>
        </footer>
      </div>`;
    root.querySelector('#to-dashboard').addEventListener('click', () => goto('#/dashboard'));
  }

  renderStep();
};
