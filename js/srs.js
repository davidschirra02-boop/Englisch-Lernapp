/* Vereinfachtes Leitner-System für den Vokabeltrainer.
   Box 0-4, Intervalle in Tagen steigen mit jeder richtigen Antwort;
   ein Fehler wirft die Karte zurück auf Box 0. */

const BOX_INTERVALS = [0, 1, 2, 4, 7, 14];

function addDaysISO(days) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

const SRS = {
  initial() {
    return { box: 0, due: Store.todayISO() };
  },

  review(entry, correct) {
    const box = correct ? Math.min(entry.box + 1, 5) : 0;
    return { box, due: addDaysISO(BOX_INTERVALS[box]) };
  },

  isDue(entry) {
    return !entry || entry.due <= Store.todayISO();
  },

  ensureWord(wordId) {
    const s = Store.get();
    if (!s.srs[wordId]) {
      Store.update(st => { st.srs[wordId] = SRS.initial(); });
    }
  },

  gradeWord(wordId, correct) {
    Store.update(s => {
      const prev = s.srs[wordId] || SRS.initial();
      s.srs[wordId] = SRS.review(prev, correct);
    });
  },

  dueWords(allWordEntries) {
    const s = Store.get();
    return allWordEntries.filter(w => SRS.isDue(s.srs[w.id]));
  }
};
