/* Persistenz: Fortschritt, Streak, SRS-Zustand in localStorage. */

const STORAGE_KEY = 'elc_progress_v1';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    dailyMinutes: 90,
    currentDay: 1,
    completedDays: {},   // { "1": { completedAt, quizScore, quizTotal } }
    streak: 0,
    lastActiveDate: null,
    srs: {},             // { wordId: { box, due } }
    voiceURI: null,      // gewählte Stimme fürs Hörverständnis
    speechRate: 0.95,
    lessonProgress: null, // { day, stepIdx } - zuletzt erreichter Schritt der laufenden Lektion
    panelAlpha: 0.45,     // 0..1: Frosted-Glass-Intensität der Kacheln (0 = ganz durchsichtig, 1 = starker Blur+dunkel), siehe applyPanelTransparency()
    bgVideoSpeed: 0.4     // playbackRate des Hintergrundvideos
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  function saveLessonStep(day, stepIdx) {
    update(s => { s.lessonProgress = { day, stepIdx }; });
  }

  function getLessonStep(day) {
    const s = load();
    return s.lessonProgress && s.lessonProgress.day === day ? s.lessonProgress.stepIdx : 0;
  }

  function clearLessonProgress() {
    update(s => { s.lessonProgress = null; });
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
  }

  return { get, update, touchToday, markDayComplete, isDayComplete, saveLessonStep, getLessonStep, clearLessonProgress, reset, todayISO };
})();
