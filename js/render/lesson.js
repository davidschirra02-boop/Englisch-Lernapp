/* Tagesansicht: führt sequenziell durch Grammatik → Vokabeln → Hören →
   Quiz (bzw. Review → Quiz an Tag 7 jeder Woche). */

const STEP_LABELS = {
  grammar: 'Grammatik',
  vocab: 'Wortschatz',
  vocabPractice: 'Wortschatz-Vertiefung',
  translation: 'Übersetzung',
  listening: 'Hörverständnis',
  quiz: 'Quiz',
  review: 'Wochen-Review'
};

Render.lesson = function (root, day) {
  const meta = getDayMeta(day);
  if (!meta) {
    root.innerHTML = `<div class="empty-state"><div class="big">🤔</div><p>Diesen Tag gibt es nicht.</p><button class="btn ghost" onclick="goto('#/dashboard')">Zurück zum Dashboard</button></div>`;
    return;
  }
  Store.setLastOpenedDay(day);

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
  const stepNames = isReview
    ? ['review', 'quiz']
    : ['grammar', 'vocab', 'vocabPractice', ...(content.translation ? ['translation'] : []), 'listening', 'quiz'];
  let stepIdx = Math.min(Store.getLessonStep(day), stepNames.length - 1);
  // Verankert lessonProgress auf diesen Tag (No-Op, falls schon so gesetzt -
  // wichtig, damit saveLessonSub/saveMissedItems beim allerersten Aufruf
  // eines Tages nicht ins Leere schreiben).
  Store.saveLessonStep(day, stepIdx);
  let quizScore = 0, quizTotal = 0;
  let missedItems = Store.getMissedItems(day);

  function shell(innerHtml, labelOverride) {
    root.innerHTML = `
      <div class="card">
        <div class="step-track">
          ${stepNames.map((s, i) => `<button type="button" class="seg ${i < stepIdx ? 'done' : ''} ${i === stepIdx ? 'active' : ''}" data-step-idx="${i}">${STEP_LABELS[s]}</button>`).join('')}
        </div>
        ${labelOverride ? `<div class="module-label">${labelOverride}</div>` : ''}
        ${innerHtml}
      </div>`;
    root.querySelectorAll('.step-track .seg').forEach(btn => {
      btn.addEventListener('click', () => goToStep(Number(btn.dataset.stepIdx)));
    });
  }

  function goToStep(i) {
    stepIdx = i;
    Store.saveLessonStep(day, stepIdx);
    renderStep();
  }

  function next() {
    goToStep(stepIdx + 1);
  }

  function renderStep() {
    const step = stepNames[stepIdx];
    if (step === 'grammar') renderGrammar();
    else if (step === 'vocab') renderVocabIntro();
    else if (step === 'vocabPractice') renderVocabPractice();
    else if (step === 'translation') renderTranslation();
    else if (step === 'listening') renderListening();
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
    const resume = Store.getLessonSub(day, 'grammar');
    QuizEngine.run(root.querySelector('#ex-slot'), spaceOutTopics(g.exercises), {
      initialIdx: resume?.idx,
      initialAnswers: resume?.answers,
      onProgress: (i, answers) => Store.saveLessonSub(day, 'grammar', { idx: i, answers }),
      onComplete: (score, total, wrong) => { missedItems.push(...wrong); Store.saveMissedItems(day, missedItems); next(); }
    });
  }

  function renderVocabIntro() {
    const words = content.vocabulary;
    const resume = Store.getLessonSub(day, 'vocab');
    let idx = (resume && Number.isInteger(resume.idx) && resume.idx >= 0 && resume.idx < words.length) ? resume.idx : 0;
    function showWord() {
      shell(`
        <div class="quiz-topline">
          <span class="muted" style="font-size:0.8rem;">Karte ${idx + 1} / ${words.length}</span>
          <button class="btn ghost small vocab-back-btn" ${idx === 0 ? 'disabled' : ''}>← Zurück</button>
        </div>
        <h2>Neue Wörter</h2><p class="muted">Karte antippen oder Enter drücken zum Umdrehen</p><div id="flash-slot"></div>`);
      const backBtn = root.querySelector('.vocab-back-btn');
      if (backBtn && idx > 0) backBtn.addEventListener('click', () => { idx--; Store.saveLessonSub(day, 'vocab', { idx }); showWord(); });
      Flashcard.render(root.querySelector('#flash-slot'), words[idx], {
        graded: false,
        onNext: () => {
          idx++;
          if (idx >= words.length) next();
          else { Store.saveLessonSub(day, 'vocab', { idx }); showWord(); }
        }
      });
    }
    showWord();
  }

  function renderVocabPractice() {
    shell(`<h2>Wortschatz-Vertiefung</h2><p class="muted">Festigen wir die neuen Wörter mit ein paar Übungen.</p><div id="practice-slot"></div>`);
    const resume = Store.getLessonSub(day, 'vocabPractice');
    QuizEngine.run(root.querySelector('#practice-slot'), spaceOutTopics(content.vocabPractice), {
      initialIdx: resume?.idx,
      initialAnswers: resume?.answers,
      speakable: true,
      simpleFeedback: true,
      onProgress: (i, answers) => Store.saveLessonSub(day, 'vocabPractice', { idx: i, answers }),
      onComplete: (score, total, wrong) => { missedItems.push(...wrong); Store.saveMissedItems(day, missedItems); next(); }
    });
  }

  function renderTranslation() {
    shell(`<h2>Übersetzung</h2><p class="muted">Übersetze den ganzen Satz ins Englische — Wortschatz und Grammatik zählen.</p><div id="translation-slot"></div>`);
    const resume = Store.getLessonSub(day, 'translation');
    QuizEngine.run(root.querySelector('#translation-slot'), spaceOutTopics(content.translation), {
      initialIdx: resume?.idx,
      initialAnswers: resume?.answers,
      onProgress: (i, answers) => Store.saveLessonSub(day, 'translation', { idx: i, answers }),
      onComplete: (score, total, wrong) => { missedItems.push(...wrong); Store.saveMissedItems(day, missedItems); next(); }
    });
  }

  function renderListening() {
    const l = content.listening;
    const resume = Store.getLessonSub(day, 'listening');
    const startInQuestions = !!(resume && resume.phase === 'questions');

    shell(`
      <h2>${l.title}</h2>
      <p class="muted">Der Text wird automatisch vorgelesen. Klicke auf 🔊, um einen Satz erneut zu hören, oder navigiere mit ↓/↑ und Enter.</p>
      <div id="story-lines"></div>
      <div id="listen-quiz-slot" style="margin-top:18px;"></div>
    `);
    const linesEl = root.querySelector('#story-lines');
    linesEl.innerHTML = l.sentences.map((s, i) => `<div class="story-line" data-i="${i}"><button class="speak-btn" data-i="${i}">🔊</button><span>${s}</span></div>`).join('');

    let playToken = 0;
    function showSpeaking(i) {
      linesEl.querySelectorAll('.speak-btn').forEach(b => b.classList.toggle('speaking', Number(b.dataset.i) === i));
    }
    function speakLine(i) {
      playToken++;
      showSpeaking(i);
      Speech.speak(l.sentences[i], { onEnd: () => showSpeaking(-1) });
    }
    function playAll() {
      const myToken = ++playToken;
      (function playFrom(i) {
        if (myToken !== playToken || i >= l.sentences.length) { if (myToken === playToken) showSpeaking(-1); return; }
        showSpeaking(i);
        Speech.speak(l.sentences[i], { onEnd: () => playFrom(i + 1) });
      })(0);
    }
    linesEl.querySelectorAll('.speak-btn').forEach(btn => {
      const line = btn.closest('.story-line');
      btn.addEventListener('focus', () => line.classList.add('focused'));
      btn.addEventListener('blur', () => line.classList.remove('focused'));
      btn.addEventListener('click', () => speakLine(Number(btn.dataset.i)));
    });

    function startQuestions(resumeQuiz) {
      playToken++;
      window.speechSynthesis?.cancel();
      Store.saveLessonSub(day, 'listening', { phase: 'questions', quiz: resumeQuiz || null });
      QuizEngine.run(root.querySelector('#listen-quiz-slot'), spaceOutTopics(l.questions), {
        initialIdx: resumeQuiz?.idx,
        initialAnswers: resumeQuiz?.answers,
        onProgress: (i, answers) => Store.saveLessonSub(day, 'listening', { phase: 'questions', quiz: { idx: i, answers } }),
        onComplete: (score, total, wrong) => { missedItems.push(...wrong); Store.saveMissedItems(day, missedItems); next(); }
      });
    }

    if (startInQuestions) {
      // Fortsetzen mitten in den Verständnisfragen: Hörtext bleibt oben weiter
      // abspielbar, aber kein erneutes automatisches Vorlesen des ganzen Texts
      // (würde beim Fortsetzen nur stören).
      startQuestions(resume.quiz);
      KeyNav.focusSoon(linesEl.querySelector('.speak-btn'));
    } else {
      root.querySelector('#listen-quiz-slot').innerHTML = '<button class="btn ghost" id="to-quiz">Weiter zu den Verständnisfragen →</button>';
      root.querySelector('#to-quiz').addEventListener('click', () => startQuestions(null));
      KeyNav.focusSoon(linesEl.querySelector('.speak-btn'));
      playAll();
    }
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
    const resume = Store.getLessonSub(day, 'quiz');
    if (resume && resume.phase === 'missedReview') {
      // Hauptquiz war beim letzten Mal schon fertig, wir waren schon in der
      // Wiederholungsrunde - Score wiederherstellen und direkt dort fortsetzen.
      quizScore = resume.score ?? quizScore;
      quizTotal = resume.total ?? quizTotal;
      renderMissedReview(finishLesson);
      return;
    }
    shell(`<h2>Abschluss-Quiz</h2><div id="quiz-slot"></div>`);
    QuizEngine.run(root.querySelector('#quiz-slot'), spaceOutTopics(content.quiz), {
      initialIdx: resume?.quiz?.idx,
      initialAnswers: resume?.quiz?.answers,
      onProgress: (i, answers) => Store.saveLessonSub(day, 'quiz', { phase: 'main', quiz: { idx: i, answers } }),
      onComplete: (score, total, wrong) => {
        quizScore = score; quizTotal = total;
        missedItems.push(...wrong);
        Store.saveMissedItems(day, missedItems);
        Store.saveLessonSub(day, 'quiz', { phase: 'missedReview', score, total });
        proceedAfterQuiz();
      }
    });
  }

  function proceedAfterQuiz() {
    if (missedItems.length > 0) renderMissedReview(finishLesson);
    else finishLesson();
  }

  function renderMissedReview(onDone) {
    // Die Item-Liste der laufenden Runde muss selbst Teil des persistierten
    // Zustands sein (nicht nur idx/answers) - missedItems wird beim Start
    // einer Runde sofort geleert (für die naechste Runde), waere also nach
    // einem Reload mitten in der Runde nicht mehr rekonstruierbar.
    const resume = Store.getLessonSub(day, 'quiz');
    const savedRound = (resume && resume.phase === 'missedReview' && resume.reviewQuiz) ? resume.reviewQuiz : null;

    let items;
    if (savedRound && Array.isArray(savedRound.items)) {
      items = savedRound.items;
    } else {
      items = spaceOutTopics(missedItems);
      missedItems = [];
      Store.saveMissedItems(day, missedItems);
    }

    shell(`
      <h2>Wiederholung</h2>
      <p class="muted">Diese Fragen hattest du falsch — beantworte sie noch einmal richtig, bevor es weitergeht.</p>
      <div id="review-slot"></div>
    `, 'Wiederholung');
    QuizEngine.run(root.querySelector('#review-slot'), items, {
      initialIdx: savedRound?.idx,
      initialAnswers: savedRound?.answers,
      onProgress: (i, answers) => Store.saveLessonSub(day, 'quiz', { phase: 'missedReview', score: quizScore, total: quizTotal, reviewQuiz: { items, idx: i, answers } }),
      onComplete: (score, total, wrong) => {
        missedItems.push(...wrong);
        Store.saveMissedItems(day, missedItems);
        if (missedItems.length > 0) {
          Store.saveLessonSub(day, 'quiz', { phase: 'missedReview', score: quizScore, total: quizTotal });
          renderMissedReview(onDone);
        } else {
          onDone();
        }
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
