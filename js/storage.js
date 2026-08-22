/* Persistenz: Fortschritt, Streak, SRS-Zustand in localStorage. */

const STORAGE_KEY = 'elc_progress_v1';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    dailyMinutes: 90,
    updatedAt: 0,        // Zeitstempel der letzten lokalen Änderung, siehe save() und GitHubSync.pull() - verhindert, dass ein Reload kurz nach einer Änderung (bevor der verzögerte Push fertig ist) den eigenen frischen Stand mit einem noch veralteten Remote-Stand überschreibt
    currentDay: 1,
    lastOpenedDay: null,  // zuletzt im Dashboard/als Lektion geöffneter Tag, unabhängig vom Fortschritt (currentDay) - bestimmt, welche Woche/welcher Tag im Dashboard vorausgewählt bzw. orange markiert ist, bis ein anderer Tag geöffnet wird
    completedDays: {},   // { "1": { completedAt, quizScore, quizTotal } }
    streak: 0,
    lastActiveDate: null,
    srs: {},             // { wordId: { box, due } }
    voiceURI: null,      // gewählte Stimme fürs Hörverständnis
    speechRate: 0.95,
    lessonProgress: null, // { day, stepIdx, missedItems, subKey, sub } - zuletzt erreichter Schritt der laufenden Lektion inkl. Fortschritt *innerhalb* des Schritts (welche Frage, welche Antworten), damit ein Reload mitten in einer Übung exakt dort fortsetzt
    panelAlpha: 0.45,     // 0..1: Frosted-Glass-Intensität der Kacheln (0 = ganz durchsichtig, 1 = starker Blur+dunkel), siehe applyPanelTransparency()
    bgVideoSpeed: 0.4,    // playbackRate des Hintergrundvideos
    vocabDirection: 'en-de', // zuletzt gewählte Abfragerichtung im Vokabeltrainer: 'en-de' oder 'de-en'
    vocabMode: 'mixed',   // zuletzt gewählte Übungsart im Vokabeltrainer: 'flashcard', 'gap' oder 'mixed'
    theme: 'glass'        // UI-Design: 'glass' (Dark Glassmorphism + Video), 'aurora' (helles Gradient-Design), 'brutalist' (Neo-Brutalismus)
  };
}

const Store = (() => {
  let state = null;

  function load() {
    if (state) return state;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
    } catch {
      state = defaultState();
    }
    return state;
  }

  function save() {
    state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('elc:save', { detail: state }));
  }

  function get() {
    return load();
  }

  function update(fn) {
    const s = load();
    fn(s);
    save();
    return s;
  }

  // Ersetzt den kompletten Zustand durch einen von außen (GitHub-Sync) geladenen
  // Stand, z.B. beim Start, wenn ein aktuellerer Fortschritt von einem anderen
  // Gerät vorliegt. Löst bewusst kein 'elc:save' aus, um keinen sofortigen
  // Rückschreib-Kreislauf zum Sync-Ziel zu erzeugen.
  function hydrate(remoteState) {
    state = { ...defaultState(), ...remoteState };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function touchToday() {
    update(s => {
      const today = todayISO();
      if (s.lastActiveDate === today) return;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      s.streak = s.lastActiveDate === yesterday ? s.streak + 1 : 1;
      s.lastActiveDate = today;
    });
  }

  function markDayComplete(day, quizScore, quizTotal) {
    update(s => {
      s.completedDays[day] = { completedAt: todayISO(), quizScore, quizTotal };
      if (day >= s.currentDay) s.currentDay = day + 1;
    });
  }

  function isDayComplete(day) {
    return !!load().completedDays[day];
  }

  function setLastOpenedDay(day) {
    update(s => { s.lastOpenedDay = day; });
  }

  function getLastOpenedDay() {
    return load().lastOpenedDay;
  }

  // Verankert lessonProgress auf (day, stepIdx). Ruft man das mit denselben
  // Werten auf, die bereits gespeichert sind (z.B. beim erneuten Mounten der
  // Lektion nach einem Reload), bleibt subKey/sub/missedItems unangetastet -
  // nur ein echter Schrittwechsel setzt den Innerhalb-Schritt-Fortschritt zurück.
  function saveLessonStep(day, stepIdx) {
    update(s => {
      const same = s.lessonProgress && s.lessonProgress.day === day && s.lessonProgress.stepIdx === stepIdx;
      if (same) return;
      if (!s.lessonProgress || s.lessonProgress.day !== day) {
        s.lessonProgress = { day, stepIdx, missedItems: [], subKey: null, sub: null };
      } else {
        s.lessonProgress.stepIdx = stepIdx;
        s.lessonProgress.subKey = null;
        s.lessonProgress.sub = null;
      }
    });
  }

  function getLessonStep(day) {
    const s = load();
    return s.lessonProgress && s.lessonProgress.day === day ? s.lessonProgress.stepIdx : 0;
  }

  // Über den Tag hinweg gesammelte, noch offene falsch beantwortete Items
  // (für die Wiederholungsrunde am Lektionsende) - überlebt Schrittwechsel.
  function getMissedItems(day) {
    const s = load();
    return (s.lessonProgress && s.lessonProgress.day === day && s.lessonProgress.missedItems) || [];
  }

  function saveMissedItems(day, items) {
    update(s => {
      if (s.lessonProgress && s.lessonProgress.day === day) s.lessonProgress.missedItems = items;
    });
  }

  // Fortschritt *innerhalb* des aktuellen Schritts (z.B. welche Frage einer
  // Übungsrunde, welche Antworten schon gegeben wurden). subKey unterscheidet
  // Unterphasen desselben Schritts (z.B. 'listening' Hörtext vs. Fragen, oder
  // 'quiz' Hauptquiz vs. Wiederholungsrunde).
  function getLessonSub(day, subKey) {
    const s = load();
    if (s.lessonProgress && s.lessonProgress.day === day && s.lessonProgress.subKey === subKey) {
      return s.lessonProgress.sub || null;
    }
    return null;
  }

  function saveLessonSub(day, subKey, sub) {
    update(s => {
      if (s.lessonProgress && s.lessonProgress.day === day) {
        s.lessonProgress.subKey = subKey;
        s.lessonProgress.sub = sub;
      }
    });
  }

  function clearLessonProgress() {
    update(s => { s.lessonProgress = null; });
  }

  return {
    get, update, hydrate, touchToday, markDayComplete, isDayComplete, setLastOpenedDay, getLastOpenedDay,
    saveLessonStep, getLessonStep, getMissedItems, saveMissedItems, getLessonSub, saveLessonSub, clearLessonProgress,
    todayISO
  };
})();
