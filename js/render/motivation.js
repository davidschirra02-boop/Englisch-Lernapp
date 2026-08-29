/* Motivation-Tab: die drei Jim-Rohn-Clips jederzeit manuell abspielbar,
   dieselbe Popup-Komponente wie bei den automatischen Triggern in
   js/render/lesson.js (Kapitelstart/-abschluss). */

Render.motivation = function (root) {
  const clips = [
    { key: 'intro', emoji: '🚀' },
    { key: 'outro', emoji: '🏁' },
    { key: 'bonus', emoji: '✨' }
  ];

  root.innerHTML = `
    <div class="motivation-grid">
      ${clips.map(c => `
        <button type="button" class="motivation-tile" data-clip="${c.key}" aria-label="${MOTIVATION_VIDEOS[c.key].title}">
          <video class="motivation-tile-video" src="${MOTIVATION_VIDEOS[c.key].src}" muted preload="metadata" playsinline></video>
          <span class="motivation-tile-icon">${c.emoji}</span>
          <span class="motivation-tile-play">▶</span>
        </button>`).join('')}
    </div>
  `;

  // Zeigt das erste Bild als Vorschau, statt eines leeren schwarzen Videofelds -
  // manche Browser rendern bei preload="metadata" erst nach einem kleinen
  // Seek einen sichtbaren Frame.
  root.querySelectorAll('.motivation-tile-video').forEach(v => {
    v.addEventListener('loadedmetadata', () => { v.currentTime = 1.5; }, { once: true });
  });

  root.querySelectorAll('[data-clip]').forEach(btn => {
    btn.addEventListener('click', () => VideoPopup.show(MOTIVATION_VIDEOS[btn.dataset.clip].src));
  });
};
