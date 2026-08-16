/* Registry aller Wochen-Inhalte. Jede Woche liegt als Ordner
   data/weeks/weekNN/ vor, mit je einer Datei pro Aufgabentyp
   (grammar.js, vocabulary.js, vocabPractice.js, translation.js,
   listening.js, quiz.js, review.js — siehe CONTENT_GUIDE.md). Jede
   dieser Dateien ruft defineWeekField() für ihr eigenes Feld auf, ohne
   die anderen Aufgabentypen der Woche zu kennen. Fehlt eine Woche
   komplett, zeigt die App einen "kommt bald"-Hinweis statt eines Fehlers. */

const WEEKS = {};

/* Setzt ein einzelnes Tages-Feld (z.B. 'translation') einer Woche, unabhängig
   von der Ladereihenfolge der anderen Aufgabentyp-Dateien derselben Woche. */
function defineWeekField(weekKey, weekTitle, day, field, value) {
  if (!WEEKS[weekKey]) WEEKS[weekKey] = { key: weekKey, title: weekTitle, days: {} };
  if (!WEEKS[weekKey].days[day]) WEEKS[weekKey].days[day] = {};
  WEEKS[weekKey].days[day][field] = value;
}

function getWeekContent(weekKey) {
  return WEEKS[weekKey] || null;
}

function getDayContent(day) {
  const meta = getDayMeta(day);
  if (!meta) return null;
  const week = getWeekContent(meta.weekKey);
  if (!week) return null;
  const content = week.days[meta.dayInWeek];
  if (!content) return null;
  return { meta, content };
}
