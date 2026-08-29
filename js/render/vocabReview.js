/* Zieht die Items für den Lektionsschritt "Wortschatz-Wiederholung": aus jedem
   bisherigen regulären Lerntag (Review-Tage haben keine eigene Vokabelliste und
   fließen daher nicht ein) wird ein zufälliges Viertel der Vokabeln gezogen und
   dafür die eigens dafür verfassten Items aus vocabPracticeReview.js verwendet -
   bei jedem Tag neu gewürfelt, damit nicht immer dieselbe Teilmenge eines
   Ursprungstages wiederholt wird. */
function buildVocabReviewItems(day) {
  const picked = [];
  for (let d = 1; d < day; d++) {
    const dc = getDayContent(d);
    const content = dc && dc.content;
    if (!content || content.review || !content.vocabPracticeReview) continue;
    const words = shuffleArray(content.vocabulary).slice(0, Math.round(content.vocabulary.length / 4));
    const wordSet = new Set(words.map(w => w.word));
    picked.push(...content.vocabPracticeReview.filter(item => wordSet.has(item.topic)));
  }
  return spaceOutTopics(picked);
}
