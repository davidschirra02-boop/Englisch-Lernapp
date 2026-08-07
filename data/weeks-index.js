/* Registry aller Wochen-Inhalte. Jede data/weeks/weekNN.js Datei registriert
   sich hier per WEEKS.weekNN = {...}. Fehlt ein Eintrag, zeigt die App
   einen "kommt bald"-Hinweis statt eines Fehlers. */

const WEEKS = {};

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
