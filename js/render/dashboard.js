/* Dashboard: Fortschrittsring, Streak, heutige Lektion, Wochenübersicht.
   Die Wochenübersicht ist zwischen allen bereits erreichten Wochen
   blätterbar (nicht nur die aktuelle Woche). */

Render.dashboard = function (root) {
  const s = Store.get();
  const day = Math.min(s.currentDay, 90);
  const finished = s.currentDay > 90;
  const meta = getDayMeta(day);
  const pct = Math.round(((day - 1) / 90) * 100);
  const wordsLearned = Object.keys(s.srs).length;
  const daysDone = Object.keys(s.completedDays).length;
  const currentWeek = meta ? meta.week : 1;
  let viewWeek = currentWeek;

  root.innerHTML = `
    <div class="card hero stagger">
      <div class="ring" style="--pct:${pct}">
        <div class="ring-label"><span class="num">${day}</span><span class="of">/ 90 Tage</span></div>
      </div>
      <div>
        <h2>${finished ? 'Programm abgeschlossen! 🎉' : 'Willkommen zurück!'}</h2>
        <p class="muted">${meta ? `${meta.weekTitle} — Woche ${meta.week}` : ''}</p>
        <div class="stat-row">
          <div class="stat-pill"><span class="icon">🔥</span> ${s.streak} Tage Streak</div>
          <div class="stat-pill amber"><span class="icon">📚</span> ${wordsLearned} Wörter gelernt</div>
          <div class="stat-pill"><span class="icon">✅</span> ${daysDone} Tage abgeschlossen</div>
        </div>
      </div>
    </div>

    <div class="card stagger">
      <div class="section-title">
        <h3>Heutige Lektion</h3>
        <span class="muted">${meta ? meta.minutesEstimate + ' Min.' : ''}</span>
      </div>
      <p>${meta ? meta.title : 'Alle verfügbaren Lektionen abgeschlossen.'}</p>
      <button class="btn" id="start-lesson" ${finished ? 'disabled' : ''}>${Store.isDayComplete(day) ? 'Nochmal üben' : 'Lektion starten'} →</button>
    </div>

    <div class="card stagger" id="week-card"></div>
  `;

  root.querySelector('#start-lesson')?.addEventListener('click', () => goto(`#/day/${day}`));

  // Kurzes Schlagwort, worum es an dem Tag inhaltlich geht - die Grammatik-
  // Regel jedes Tages ist das konkreteste, was die Daten hergeben (Vokabeln/
  // Quiz haben keinen eigenen Titel). Für Wochen ohne Inhalt (noch nicht
  // geschriebene Wochen) bleibt es leer, die Kachel zeigt dann nur die Zahl.
  function dayTopic(dn) {
    return getDayContent(dn)?.content?.grammar?.ruleTitle || '';
  }

  function renderWeekCard() {
    const weekDays = CURRICULUM.filter(d => d.week === viewWeek);
    const weekTitle = weekDays[0]?.weekTitle || '';
    const chips = weekDays.map(d => {
      const dn = d.day;
      const accessible = dn <= day;
      const cls = Store.isDayComplete(dn) ? 'done' : (dn === day ? 'today' : '');
      const topic = dayTopic(dn);
      return `<button type="button" class="day-chip ${cls} ${accessible ? 'clickable' : ''}" data-day="${dn}" ${accessible ? '' : 'disabled'} ${topic ? `title="${topic}"` : ''}>
        <span class="day-chip-num">${dn}</span>
        ${topic ? `<span class="day-chip-topic">${topic}</span>` : ''}
      </button>`;
    }).join('');

    root.querySelector('#week-card').innerHTML = `
      <div class="section-title">
        <h3>Woche ${viewWeek}${weekTitle ? ' — ' + weekTitle : ''}</h3>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn ghost small" id="prev-week" ${viewWeek <= 1 ? 'disabled' : ''}>← Vorherige</button>
          <button type="button" class="btn ghost small" id="next-week" ${viewWeek >= currentWeek ? 'disabled' : ''}>Nächste →</button>
        </div>
      </div>
      <div class="week-strip">${chips}</div>
    `;

    root.querySelectorAll('.day-chip.clickable').forEach(chip => {
      chip.addEventListener('click', () => goto(`#/day/${chip.dataset.day}`));
    });
    root.querySelector('#prev-week')?.addEventListener('click', () => { viewWeek--; renderWeekCard(); });
    root.querySelector('#next-week')?.addEventListener('click', () => { viewWeek++; renderWeekCard(); });
  }

  renderWeekCard();
};
