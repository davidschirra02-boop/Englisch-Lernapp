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
  SELECTOR: 'button:not(:disabled), a[href], input[type="text"]:not(:disabled), input[type="password"]:not(:disabled), [role="button"]',
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
     (z.B. KeyNav.focusSoon auf eine bestimmte Karte) nicht gestört werden. */
  focusFirstIfLost() {
    if (document.activeElement && document.activeElement !== document.body) return;
    document.querySelector(KeyNav.CONTENT_SELECTOR)?.querySelector(KeyNav.SELECTOR)?.focus();
  },

  /* Ein Klick auf eine nicht-bedienbare Stelle (leerer Bereich, Fließtext,
     ein deaktivierter Button ...) setzt den echten Fokus normalerweise auf
     <body> zurück - danach reagieren Pfeiltasten auf nichts mehr, bis man
     gezielt ein Eingabefeld anklickt. Fängt das ab: nach jedem Klick, der
     nicht ohnehin schon ein bedienbares Element trifft (dessen Fokus der
     Browser selbst setzt), wird das dem Klickpunkt räumlich nächstgelegene
     bedienbare Element fokussiert, damit Pfeiltasten sofort wieder greifen -
     unabhängig davon, wohin in der App man klickt. Die Suche bleibt dabei
     auf den Inhaltsbereich beschränkt, wenn der Klick dort stattfand - sonst
     könnte ein Klick knapp neben einer Karte (z.B. im Vokabeltrainer) den
     räumlich nächsten Navigationsreiter (z.B. "Dashboard") fokussieren, und
     ein anschließendes Enter würde ungewollt dorthin springen statt die
     Karte umzudrehen. */
  focusNearestOnStrayClick(e) {
    if (e.target.closest(KeyNav.SELECTOR)) return;
    const scope = e.target.closest(KeyNav.CONTENT_SELECTOR) || document;
    let candidates = Array.from(scope.querySelectorAll(KeyNav.SELECTOR));
    if (candidates.length === 0) candidates = Array.from(document.querySelectorAll(KeyNav.SELECTOR));
    if (candidates.length === 0) return;
    let nearest = null, bestDist = Infinity;
    candidates.forEach(el => {
      const r = el.getBoundingClientRect();
      const dist = Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
      if (dist < bestDist) { bestDist = dist; nearest = el; }
    });
    nearest?.focus();
  },

  init() {
    KeyNav.wireAll();
    KeyNav.focusFirstIfLost();
    document.addEventListener('click', KeyNav.focusNearestOnStrayClick);
    new MutationObserver(() => {
      KeyNav.wireAll();
      /* Wichtig: per setTimeout(...,0) verzögern, NICHT direkt hier aufrufen.
         Im QuizEngine wird das beantwortete Element (Auswahl-Button/Eingabe)
         beim Auswerten disabled — das wirft den Fokus sofort auf <body>
         zurück, noch bevor QuizEngine.bindNext() per KeyNav.focusSoon() den
         "Weiter"-Button fokussiert. Würde focusFirstIfLost hier synchron
         (als Microtask) reagieren, würde es fälschlich den zuvor im Markup
         stehenden "← Zurück"-Button fokussieren — und da Browser Enter beim
         Loslassen an das GERADE fokussierte Element weiterleiten, feuert
         dann ein ungewollter Klick auf "← Zurück" und man springt eine
         Frage zurück. Der setTimeout(...,0) hier läuft immer NACH einem
         bereits synchron geplanten focusSoon(...,0), sodass ein echtes
         Fokus-Ziel stets zuerst gewinnt und dieser Fallback nur noch dann
         greift, wenn wirklich niemand den Fokus gesetzt hat. */
      setTimeout(KeyNav.focusFirstIfLost, 0);
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
