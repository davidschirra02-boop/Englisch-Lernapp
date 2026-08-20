/* Grammatik-Tab: Kapitel (= Wochenthema) auswählen, dann ein Thema
   (= Grammatikregel eines Tages, oder "alle Themen gemischt"), dann die
   Übungsart (gemischt / nur Lückentexte / nur Multiple-Choice). Nutzt die
   bereits in den Tageslektionen vorhandenen Grammatik-Übungen — hier aber
   gebündelt pro Kapitel, neu gemischt und beliebig oft wiederholbar, statt
   nur einmal im linearen Tagesablauf zu erscheinen. */

Render.grammar = function (root) {
  const s = Store.get();
  const reachedWeeks = [...new Set(CURRICULUM.filter(d => d.day <= s.currentDay).map(d => d.week))];
  const chapters = reachedWeeks
    .map(w => ({ week: w, weekKey: 'week' + String(w).padStart(2, '0'), theme: WEEK_THEMES[(w - 1) % WEEK_THEMES.length] }))
    .map(c => ({ ...c, content: getWeekContent(c.weekKey) }))
    .filter(c => c.content);

  if (chapters.length === 0) {
    root.innerHTML = `
      <div class="card empty-state">
        <div class="big">📐</div>
        <p>Noch keine Grammatik-Kapitel freigeschaltet.</p>
        <p class="muted">Schließe deine erste Tageslektion ab, dann tauchen hier Übungskapitel auf.</p>
        <button class="btn ghost" onclick="goto('#/dashboard')">Zum Dashboard</button>
      </div>`;
    return;
  }

  function topics(chapter) {
    return Object.entries(chapter.content.days)
      .filter(([, day]) => day.grammar)
      .map(([dayInWeek, day]) => ({ dayInWeek: Number(dayInWeek), title: day.grammar.scenario, exercises: day.grammar.exercises }));
  }

  renderHub();

  function renderHub() {
    root.innerHTML = `
      <div class="card">
        <h3>Grammatik</h3>
        <p class="muted">Wähle ein Kapitel, um die Grammatikregeln dieser Woche gezielt zu wiederholen.</p>
      </div>
      <div class="card">
        <h3>Kapitel</h3>
        ${chapters.map(c => `
          <div class="chapter-row">
            <div>
              <strong>Woche ${c.week} — ${c.theme}</strong>
              <div class="muted" style="font-size:0.8rem;">${topics(c).length} Themen</div>
            </div>
            <button class="btn ghost small" data-week="${c.week}">Öffnen →</button>
          </div>`).join('')}
      </div>`;
    root.querySelectorAll('[data-week]').forEach(btn => {
      btn.addEventListener('click', () => renderTopics(chapters.find(c => c.week === Number(btn.dataset.week))));
    });
  }

  function renderTopics(chapter) {
    const tops = topics(chapter);
    root.innerHTML = `
      <div class="card">
        <button class="btn ghost small" id="back-to-hub">← Zurück zur Übersicht</button>
        <h3 style="margin-top:10px;">Woche ${chapter.week} — ${chapter.theme}</h3>
      </div>
      <div class="card">
        <div class="chapter-row">
          <div>
            <strong>Alle Themen gemischt</strong>
            <div class="muted" style="font-size:0.8rem;">${tops.reduce((n, t) => n + t.exercises.length, 0)} Übungen</div>
          </div>
          <button class="btn ghost small" id="topic-all">Üben →</button>
        </div>
        ${tops.map((t, i) => `
          <div class="chapter-row">
            <div>
              <strong>${t.title}</strong>
              <div class="muted" style="font-size:0.8rem;">${t.exercises.length} Übungen</div>
            </div>
            <button class="btn ghost small" data-topic="${i}">Üben →</button>
          </div>`).join('')}
      </div>`;
    root.querySelector('#back-to-hub').addEventListener('click', renderHub);
    root.querySelector('#topic-all').addEventListener('click', () => renderTypeChoice(chapter, tops.flatMap(t => t.exercises), 'Alle Themen'));
    root.querySelectorAll('[data-topic]').forEach(btn => {
      const t = tops[Number(btn.dataset.topic)];
      btn.addEventListener('click', () => renderTypeChoice(chapter, t.exercises, t.title));
    });
  }

  function renderTypeChoice(chapter, exercises, title) {
    root.innerHTML = `
      <div class="card">
        <button class="btn ghost small" id="back-to-topics">← Zurück</button>
        <h3 style="margin-top:10px;">${title}</h3>
        <p class="muted">Welche Übungsart möchtest du üben?</p>
        <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;">
          <button class="btn ghost" id="type-all">Gemischt</button>
          <button class="btn ghost" id="type-gap">Nur Lückentexte</button>
          <button class="btn ghost" id="type-choice">Nur Multiple-Choice</button>
        </div>
      </div>`;
    root.querySelector('#back-to-topics').addEventListener('click', () => renderTopics(chapter));
    root.querySelector('#type-all').addEventListener('click', () => startPractice(chapter, exercises, title, 'all'));
    root.querySelector('#type-gap').addEventListener('click', () => startPractice(chapter, exercises, title, 'gap'));
    root.querySelector('#type-choice').addEventListener('click', () => startPractice(chapter, exercises, title, 'choice'));
  }

  function startPractice(chapter, exercises, title, filter) {
    let pool = filter === 'all' ? exercises : exercises.filter(it => it.type === filter);
    pool = spaceOutTopics(shuffleArray(pool));
    if (pool.length === 0) {
      root.innerHTML = `
        <div class="card empty-state">
          <p class="muted">Für diese Auswahl gibt es hier keine Übungen.</p>
          <button class="btn ghost" id="back">← Zurück</button>
        </div>`;
      root.querySelector('#back').addEventListener('click', () => renderTypeChoice(chapter, exercises, title));
      return;
    }
    root.innerHTML = `<div class="card"><div class="module-label">${title}</div><div id="practice-slot"></div></div>`;
    QuizEngine.run(root.querySelector('#practice-slot'), pool, { onComplete: () => renderDone(chapter) });
  }

  function renderDone(chapter) {
    root.innerHTML = `
      <div class="card empty-state">
        <div class="big">🎉</div>
        <h3>Runde abgeschlossen!</h3>
        <p class="muted">Du kannst jedes Thema jederzeit erneut üben — die Übungen werden dabei neu gemischt.</p>
        <button class="btn ghost" id="back-to-hub2">← Zurück zur Übersicht</button>
      </div>`;
    root.querySelector('#back-to-hub2').addEventListener('click', renderHub);
  }
};
