/* Generische Pfeiltasten-Navigation für die ganze App. Bewegt den echten
   Fokus mit ↑/↓ zwischen interaktiven Elementen (Buttons, Links, Text-
   felder) in Dokumentreihenfolge. Enter/Leertaste aktivieren das fokussierte
   Element bereits nativ per Browser-Standardverhalten — dafür ist kein
   eigener Code nötig. Ein MutationObserver verkabelt neu eingefügte
   Elemente automatisch, sodass Render-Funktionen KeyNav nie selbst
   aufrufen müssen. */

const KeyNav = {
  SELECTOR: 'button:not(:disabled), a[href], input[type="text"]:not(:disabled)',

  wireOne(el) {
    if (el.dataset.keynavWired) return;
    el.dataset.keynavWired = '1';
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const current = Array.from(document.querySelectorAll(KeyNav.SELECTOR));
      const idx = current.indexOf(el);
      const next = current[idx + (e.key === 'ArrowDown' ? 1 : -1)];
      next?.focus();
    });
  },

  wireAll() {
    document.querySelectorAll(KeyNav.SELECTOR).forEach(KeyNav.wireOne);
  },

  init() {
    KeyNav.wireAll();
    new MutationObserver(() => KeyNav.wireAll()).observe(document.body, { childList: true, subtree: true });
  },

  /* Fokussiert ein Element erst im nächsten Tick. Nötig für Fokuswechsel,
     die aus einem Klick-Handler heraus passieren: wird ein neuer Button
     noch innerhalb desselben Enter-Tastendrucks fokussiert, lösen manche
     Browser (keydown-Klick, danach keypress auf das neu fokussierte
     Element) eine zweite, ungewollte Aktivierung aus — das würde z.B. eine
     ganze Quizfrage überspringen. Der Timeout verschiebt den Fokus hinter
     das Ende dieser Tastendruck-Sequenz. */
  focusSoon(el) {
    setTimeout(() => el?.focus(), 0);
  }
};

KeyNav.init();
