/* Dashboard: Fortschrittsring, Streak, heutige Lektion, Wochenübersicht. */

Render.dashboard = function (root) {
  const s = Store.get();
  const day = Math.min(s.currentDay, 90);
  const finished = s.currentDay > 90;
  const meta = getDayMeta(day);
  const pct = Math.round(((day - 1) / 90) * 100);
  const wordsLearned = Object.keys(s.srs).length;
  const daysDone = Object.keys(s.completedDays).length;

  const weekStartDay = meta ? day - meta.dayInWeek + 1 : 1;
  let chips = '';
  for (let i = 0; i < 7 && weekStartDay + i <= 90; i++) {
    const dn = weekStartDay + i;
    const accessible = dn <= day;
    const cls = Store.isDayComplete(dn) ? 'done' : (dn === day ? 'today' : '');
    chips += `<button type="button" class="day-chip ${cls} ${accessible ? 'clickable' : ''}" data-day="${dn}" ${accessible ? '' : 'disabled'}>${dn}</button>`;
  }

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

    <div class="card stagger">
      <h3>Diese Woche</h3>
      <div class="week-strip">${chips}</div>
    </div>
  `;

  root.querySelector('#start-lesson')?.addEventListener('click', () => goto(`#/day/${day}`));
  root.querySelectorAll('.day-chip.clickable').forEach(chip => {
    chip.addEventListener('click', () => goto(`#/day/${chip.dataset.day}`));
  });
};
