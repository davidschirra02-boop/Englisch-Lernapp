/* Motivation-Tab: die drei Jim-Rohn-Clips jederzeit manuell abspielbar,
   dieselbe Popup-Komponente wie bei den automatischen Triggern in
   js/render/lesson.js (Kapitelstart/-abschluss). */

Render.motivation = function (root) {
  const clips = [
    { key: 'intro', emoji: '🚀', desc: 'Der Clip, der zu Beginn jeder neuen Lektion aufpoppt.' },
    { key: 'outro', emoji: '🏁', desc: 'Der Clip, der nach jedem erfolgreich abgeschlossenen Lerntag aufpoppt.' },
    { key: 'bonus', emoji: '✨', desc: 'Extra-Motivation zum jederzeitigen Anschauen.' }
  ];

  root.innerHTML = `
    <div class="card">
      <h3>Motivation</h3>
      <p class="muted">Die Jim-Rohn-Clips, die dich beim Lernen begleiten — hier kannst du sie dir jederzeit noch einmal ansehen.</p>
    </div>
    ${clips.map(c => `
      <div class="card chapter-row">
        <div>
          <strong>${c.emoji} ${MOTIVATION_VIDEOS[c.key].title}</strong>
          <div class="muted" style="font-size:0.8rem;">${c.desc}</div>
        </div>
        <button class="btn ghost small" data-clip="${c.key}">▶ Abspielen</button>
      </div>`).join('')}
  `;

  root.querySelectorAll('[data-clip]').forEach(btn => {
    btn.addEventListener('click', () => VideoPopup.show(MOTIVATION_VIDEOS[btn.dataset.clip].src));
  });
};
