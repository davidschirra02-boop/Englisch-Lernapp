/* KI-gestützte Bewertung für Satzübersetzungs-Aufgaben (type: 'translate' in
   js/quizEngine.js). Ruft einen Cloudflare-Worker-Proxy auf (worker/src/index.js),
   der die eigentliche Bewertung an Claude weiterreicht — der API-Key liegt
   dort serverseitig als Secret, nie im Frontend.

   Ein einzelner Aufruf-Versuch wird bei einem Fehler (Timeout, Netzwerk, kaputte
   Antwort) einmal automatisch wiederholt, bevor auf TranslationCheck.classify
   zurückgefallen wird — die meisten Aussetzer (kurzer Netzwerkhänger, "kalter
   Start" des Workers) sind einmalig und beim zweiten Versuch schon behoben, sodass
   praktisch immer die KI (und nicht die schwächere lokale Heuristik) die Antwort
   bewertet. Endgültig unerreichbar bleibt sie nur bei einem echten, andauernden
   Ausfall — dann greift der Fallback, damit eine Aufgabe nie unbewertet bleibt. */

const AIGrading = (function () {
  const WORKER_URL = 'https://wegweiser-translate-grader.davidschirra.workers.dev';
  const CLIENT_HEADER_VALUE = 'wegweiser-app-v1';
  const TIMEOUT_MS = 9000;
  const RETRY_DELAY_MS = 400;

  async function attempt(userText, item, targetVariants) {
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
    } finally {
      clearTimeout(timer);
    }
  }

  async function classify(userText, item) {
    const targetVariants = Array.isArray(item.answer) ? item.answer : [item.answer];
    try {
      return await attempt(userText, item, targetVariants);
    } catch (firstErr) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      try {
        return await attempt(userText, item, targetVariants);
      } catch (secondErr) {
        console.warn('[AIGrading] KI-Bewertung nach 2 Versuchen fehlgeschlagen, falle auf lokale Heuristik zurück:', firstErr, secondErr);
        return TranslationCheck.classify(userText, item);
      }
    }
  }

  return { classify };
})();
