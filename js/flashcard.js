/* Wiederverwendbare Flashcard-Komponente: Eintritts-Modus (nur "Weiter")
   und SRS-Modus (Bewertung "Wusste ich nicht" / "Wusste ich!"). */

const Flashcard = {
  render(container, word, { graded = false, onNext } = {}) {
    let flipped = false;
    container.innerHTML = `
      <div class="flash-wrap">
        <div class="flashcard">
          <div class="flash-face front">
            <div class="category">${word.category || ''}</div>
            <div class="word">${word.word}</div>
          </div>
          <div class="flash-face back">
            <div class="translation">${word.translation}</div>
            <div class="mnemonic">💡 ${word.mnemonic || ''}</div>
          </div>
        </div>
      </div>
      <div class="example-box"><span class="en">${word.example}</span></div>
      <div class="srs-controls" id="srs-controls" style="display:none;"></div>
    `;

    const card = container.querySelector('.flashcard');
    const controls = container.querySelector('#srs-controls');

    function flip() {
      if (flipped) return;
      flipped = true;
      card.classList.add('flipped');
      controls.style.display = 'flex';
      controls.innerHTML = graded
        ? `<button class="btn ghost" data-ok="0">Nochmal üben</button><button class="btn" data-ok="1">Wusste ich!</button>`
        : `<button class="btn" data-ok="1">Weiter →</button>`;
      controls.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onNext?.(btn.dataset.ok === '1');
        });
      });
      KeyNav.focusSoon(controls.querySelector('button'));
    }

    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Karte umdrehen');
    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
    KeyNav.focusSoon(card);
  }
};
