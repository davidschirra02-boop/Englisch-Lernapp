/* 90-Tage-Gerüst. Tatsächliche Lektionsinhalte liegen pro Woche in data/weeks/weekNN.js
   und werden erst nach und nach ergänzt (siehe CONTENT_GUIDE.md). Fehlt eine Woche,
   zeigt die App einen freundlichen "kommt bald"-Hinweis statt eines Fehlers. */

const WEEK_THEMES = [
  'Ankommen & Small Talk',
  'Reisen & Unterwegs',
  'Einkaufen & Konsum',
  'Arbeit & Karriere',
  'Essen & Restaurant',
  'Gesundheit & Notfälle',
  'Zuhause & Alltag',
  'Freizeit & Hobbys',
  'Medien & Meinungen',
  'Beziehungen & Gefühle',
  'Wissenschaft & Technik',
  'Umwelt & Gesellschaft',
  'Große Wiederholung'
];

function buildCurriculum(totalDays = 90) {
  const days = [];
  let day = 1;
  let weekNum = 1;
  while (day <= totalDays) {
    const theme = WEEK_THEMES[(weekNum - 1) % WEEK_THEMES.length];
    const weekKey = 'week' + String(weekNum).padStart(2, '0');
    const daysThisWeek = Math.min(7, totalDays - day + 1);
    for (let d = 1; d <= daysThisWeek; d++) {
      const isReviewDay = d === 7;
      days.push({
        day,
        week: weekNum,
        weekKey,
        dayInWeek: d,
        weekTitle: theme,
        title: isReviewDay ? `${theme} – Wochen-Review` : `${theme} – Tag ${d}`,
        focusAreas: isReviewDay
          ? ['review', 'quiz']
          : ['grammar', 'vocab', 'listening', 'quiz'],
        minutesEstimate: 90
      });
      day++;
    }
    weekNum++;
  }
  return days;
}

const CURRICULUM = buildCurriculum(90);

function getDayMeta(day) {
  return CURRICULUM.find(d => d.day === Number(day));
}
