/* Generische Pfeiltasten-Navigation für die ganze App. Bewegt den echten
   Fokus mit ↑/↓ zwischen interaktiven Elementen (Buttons, Links, Text-
   felder) in Dokumentreihenfolge. Zusätzlich bewegen ←/→ den Fokus
   räumlich zum nächsten Element in derselben visuellen Reihe (z.B.
   nebeneinanderliegende Buttons, Navigationsreiter, Wochentag-Kacheln) —
   dafür werden die Bounding-Rects verglichen statt der Dokumentreihenfolge,
   damit "nebeneinander" wirklich "nebeneinander" bedeutet, unabhängig vom
   Markup. Enter/Leertaste aktivieren das fokussierte Element bereits nativ
   per Browser-Standardverhalten — dafür ist kein eigener Code nötig. Ein
   MutationObserver verkabelt neu eingefügte Elemente automatisch, sodass
   Render-Funktionen KeyNav nie selbst aufrufen müssen. */

const KeyNav = {
  SELECTOR: 'button:not(:disabled), a[href], input[type="text"]:not(:disabled)',
  CONTENT_SELECTOR: '#app-root-content',

  wireOne(el) {
    if (el.dataset.keynavWired) return;
    el.dataset.keynavWired = '1';
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const current = Array.from(document.querySelectorAll(KeyNav.SELECTOR));
        const idx = current.indexOf(el);
        const next = current[idx + (e.key === 'ArrowDown' ? 1 : -1)];
        next?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const next = KeyNav.horizontalNeighbor(el, e.key === 'ArrowRight' ? 1 : -1);
        if (next) { e.preventDefault(); next.focus(); }
      }
    });
  },

  wireAll() {
    document.querySelectorAll(KeyNav.SELECTOR).forEach(KeyNav.wireOne);
  },

  /* Sucht das nächste fokussierbare Element in Richtung dir (-1 links,
     +1 rechts), dessen vertikale Mitte grob auf derselben Höhe liegt wie
     die von el ("dieselbe Reihe"). Elemente untereinander (z.B. eine
     Antwortliste in Spaltenrichtung) haben unterschiedliche vertikale
     Mitten und werden dadurch automatisch ausgeschlossen. */
  horizontalNeighbor(el, dir) {
    const rect = el.getBoundingClientRect();
    const midY = (rect.top + rect.bottom) / 2;
    const candidates = Array.from(document.querySelectorAll(KeyNav.SELECTOR))
      .filter(c => c !== el)
      .map(c => ({ el: c, rect: c.getBoundingClientRect() }))
      .filter(c => Math.abs((c.rect.top + c.rect.bottom) / 2 - midY) < Math.max(rect.height, c.rect.height) * 0.6)
      .filter(c => dir > 0 ? c.rect.left > rect.left + 1 : c.rect.left < rect.left - 1);
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => Math.abs(a.rect.left - rect.left) - Math.abs(b.rect.left - rect.left));
    return candidates[0].el;
  },

  /* Fokussiert automatisch das erste bedienbare Element im Inhaltsbereich,
     sobald eine Ansicht neu gerendert wird und dabei der Fokus verlorengeht
     (root.innerHTML-Ersetzung setzt den Fokus stets auf <body> zurück).
     Nur wenn der Fokus wirklich verloren ist (activeElement === body) wird
     eingegriffen, damit gezielte Fokus-Setzungen einzelner Render-Funktionen
     (z.B. KeyNav.focusSoon auf eine bestimmte Karte) nicht gestört werden —
     deren setTimeout(...,0) läuft ohnehin erst NACH diesem MutationObserver-
     Callback und gewinnt somit. So bleibt die App auch außerhalb von
     Übungen (Dashboard, Abschluss-Screens, Einstellungen, ...) komplett
     ohne Maus bedienbar. */
  focusFirstIfLost() {
    if (document.activeElement && document.activeElement !== document.body) return;
    document.querySelector(KeyNav.CONTENT_SELECTOR)?.querySelector(KeyNav.SELECTOR)?.focus();
  },

  init() {
    KeyNav.wireAll();
    KeyNav.focusFirstIfLost();
    new MutationObserver(() => {
      KeyNav.wireAll();
      KeyNav.focusFirstIfLost();
    }).observe(document.body, { childList: true, subtree: true });
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
