/* KI-gestützte Bewertung für Satzübersetzungs-Aufgaben (type: 'translate' in
   js/quizEngine.js). Ruft einen Cloudflare-Worker-Proxy auf (worker/src/index.js),
   der die eigentliche Bewertung an Claude weiterreicht — der API-Key liegt
   dort serverseitig als Secret, nie im Frontend.

   Fällt bei jedem Fehler (Timeout, Netzwerk, kaputte Antwort) automatisch auf
   TranslationCheck.classify zurück, damit eine Aufgabe nie unbewertet bleibt. */

const AIGrading = (function () {
  const WORKER_URL = 'https://wegweiser-translate-grader.davidschirra.workers.dev';
  const CLIENT_HEADER_VALUE = 'wegweiser-app-v1';
  const TIMEOUT_MS = 9000;

  async function classify(userText, item) {
    const targetVariants = Array.isArray(item.answer) ? item.answer : [item.answer];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wegweiser-Client': CLIENT_HEADER_VALUE
        },
        body: JSON.stringify({
          german_sentence: item.prompt,
          target_english_sentence: targetVariants.join(' / '),
          user_input: userText
        }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`worker responded ${res.status}`);

      const data = await res.json();
      if (typeof data.is_correct !== 'boolean') throw new Error('unexpected response shape');

      return {
        tier: data.is_correct ? (data.feedback ? 'close-typo' : 'exact') : 'wrong',
        closest: targetVariants[0],
        source: 'ai',
        aiFeedback: data.feedback || null
      };
    } catch {
      return TranslationCheck.classify(userText, item);
    } finally {
      clearTimeout(timer);
    }
  }

  return { classify };
})();
