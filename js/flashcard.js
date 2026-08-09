/* Wiederverwendbare Flashcard-Komponente: Eintritts-Modus (nur "Weiter")
   und SRS-Modus (Bewertung "Wusste ich nicht" / "Wusste ich!"). Mit
   reversed:true wird die Abfragerichtung gedreht (Deutsch → Englisch statt
   Englisch → Deutsch), damit beide Richtungen trainiert werden.
   Im SRS-Modus liegen die beiden Bewertungs-Buttons nebeneinander; ←/→
   wechselt zwischen ihnen bereits automatisch über KeyNav.horizontalNeighbor
   (siehe keynav.js). ↑/↓ ist hier bewusst deaktiviert, siehe flip(), da die
   Buttons keine sinnvolle vertikale Nachbarschaft haben. */

const Flashcard = {
  render(container, word, { graded = false, onNext, reversed = false } = {}) {
    let flipped = false;
    const frontText = reversed ? word.translation : word.word;
    const backText = reversed ? word.word : word.translation;
    container.innerHTML = `
      <div class="flash-wrap">
        <div class="flashcard">
          <div class="flash-face front">
            <div class="category">${word.category || ''}</div>
            <div class="word">${frontText}</div>
          </div>
          <div class="flash-face back">
            <div class="translation">${backText}</div>
            <div class="mnemonic">💡 ${word.mnemonic || ''}</div>
          </div>
        </div>
      </div>
      <div class="example-box" id="example-box" style="${reversed ? 'visibility:hidden;' : ''}"><span class="en">${word.example}</span></div>
      <div class="srs-controls" id="srs-controls" style="display:none;"></div>
    `;

    const card = container.querySelector('.flashcard');
    const controls = container.querySelector('#srs-controls');
    const exampleBox = container.querySelector('#example-box');

    function flip() {
      if (flipped) return;
      flipped = true;
      card.classList.add('flipped');
      if (reversed) exampleBox.style.visibility = 'visible';
      controls.style.display = 'flex';
      controls.innerHTML = graded
        ? `<button class="btn ghost" data-ok="0">Nochmal üben</button><button class="btn" data-ok="1">Wusste ich!</button>`
        : `<button class="btn" data-ok="1">Weiter →</button>`;
      const ctrlButtons = Array.from(controls.querySelectorAll('button'));
      ctrlButtons.forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onNext?.(btn.dataset.ok === '1');
        });
        if (graded) {
          btn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          });
        }
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
