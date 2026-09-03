/* Cloudflare-Worker-Proxy fuer die KI-Bewertung von Uebersetzungsaufgaben.
   Haelt den Anthropic-API-Key serverseitig als Secret (die App selbst ist
   rein statisch und darf nie einen Key im Frontend-Code haben). Nimmt vom
   Frontend nur den deutschen Ausgangssatz, die Musterloesung und die
   Nutzereingabe entgegen, baut daraus die Anfrage an Claude und reicht das
   Bewertungsergebnis zurueck. Wird per `npx wrangler deploy` aus diesem
   Ordner veroeffentlicht, siehe README-Hinweis in js/aiGrading.js. */

const SYSTEM_PROMPT = `Du bist ein strenger, aber fairer Englischlehrer. Deine Aufgabe ist es, die englische Übersetzung eines Nutzers basierend auf einem deutschen Ausgangssatz und einer englischen Musterlösung zu bewerten.

BEWERTUNGSREGELN:
1. Bedeutung & Grammatik: Die Antwort MUSS grammatikalisch einwandfrei sein und die exakte Bedeutung des Ausgangssatzes wiedergeben. Falsche Zeiten (Tenses), falscher Satzbau oder fehlende Kerninformationen führen zwingend zu "is_correct": false.
2. Synonyme & Alternativen: Akzeptiere alle natürlichen, grammatikalisch korrekten Synonyme und alternative Satzstrukturen. Britisches und Amerikanisches Englisch sind absolut gleichwertig.
3. Kurzformen: Akzeptiere alle validen Kurzformen (z.B. "aren't" = "are not", "I've" = "I have") gleichermaßen.
4. Tippfehler (Typos): Ein einzelner, offensichtlicher Buchstabendreher (z.B. "becuase" statt "because") wird als KORREKT gewertet, MUSS aber im Feedback korrigiert werden. WICHTIG: Wenn der Tippfehler ein anderes, reales Wort ergibt (z.B. "there" statt "their", "where" statt "were"), ist die gesamte Antwort FALSCH.
5. Slang: Extreme Umgangssprache (z.B. "wanna", "gonna", "ain't") ist als FALSCH zu werten, es sei denn, die Musterlösung verwendet sie explizit.
6. Satzzeichen & Groß-/Kleinschreibung: Ignoriere fehlende Punkte am Satzende und Fehler in der Groß-/Kleinschreibung völlig.

FEEDBACK-REGELN:
- Wenn "is_correct": true und es sich um eine perfekte Antwort handelt, setze feedback zwingend auf null.
- Wenn "is_correct": true, aber ein kleiner Tippfehler vorliegt oder eine Kurzform natürlicher wäre, gib ein kurzes, lobendes Feedback mit dem Verbesserungsvorschlag auf Deutsch.
- Wenn "is_correct": false, erkläre in einem kurzen, freundlichen Satz auf Deutsch, wo der Fehler lag (ohne die komplette Lösung einfach nur abzutippen).

FORMATIERUNGS-REGELN (CRITICAL):
Dein Output MUSS ein striktes, valides JSON-Objekt sein.
Gib KEINEN Text vor oder nach dem JSON aus. Verwende KEINE Markdown-Formatierungen wie \`\`\`json.
Gib exakt und ausschließlich diese Struktur aus:

{
  "is_correct": boolean,
  "feedback": string or null
}`;

const ALLOWED_ORIGIN = 'https://davidschirra02-boop.github.io';
const CLIENT_HEADER_VALUE = 'wegweiser-app-v1';

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === ALLOWED_ORIGIN) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

function corsHeadersFor(origin, allowed) {
  if (!allowed) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Wegweiser-Client',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = isAllowedOrigin(origin);
    const cors = corsHeadersFor(origin, allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: allowed ? 204 : 403, headers: cors });
    }
    if (!allowed) {
      return new Response('Forbidden', { status: 403 });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors });
    }
    if (request.headers.get('X-Wegweiser-Client') !== CLIENT_HEADER_VALUE) {
      return new Response('Forbidden', { status: 403, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad Request', { status: 400, headers: cors });
    }

    const { german_sentence, target_english_sentence, user_input } = body || {};
    if (!german_sentence || !target_english_sentence || typeof user_input !== 'string') {
      return new Response('Bad Request', { status: 400, headers: cors });
    }

    const userMessage = `<ausgangssatz>${german_sentence}</ausgangssatz>\n<musterloesung>${target_english_sentence}</musterloesung>\n<nutzereingabe>${user_input}</nutzereingabe>`;

    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          temperature: 0,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }]
        })
      });
    } catch {
      return new Response('Upstream error', { status: 502, headers: cors });
    }

    if (!upstream.ok) {
      return new Response('Upstream error', { status: 502, headers: cors });
    }

    let upstreamData;
    try {
      upstreamData = await upstream.json();
    } catch {
      return new Response('Upstream error', { status: 502, headers: cors });
    }

    const rawText = upstreamData?.content?.[0]?.text;
    if (typeof rawText !== 'string') {
      return new Response('Upstream error', { status: 502, headers: cors });
    }

    const cleaned = rawText.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response('Bad AI response', { status: 502, headers: cors });
    }

    if (typeof parsed.is_correct !== 'boolean') {
      return new Response('Bad AI response', { status: 502, headers: cors });
    }

    return new Response(JSON.stringify({
      is_correct: parsed.is_correct,
      feedback: typeof parsed.feedback === 'string' ? parsed.feedback : null
    }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }
};
