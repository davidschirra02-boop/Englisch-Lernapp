/* Wrapper um die browsereigene Web Speech API für Spracherkennung
   (kostenlos, kein API-Key, kein eigenes Berechtigungs-Handling nötig -
   der Browser fragt beim ersten Start selbst nach Mikrofonzugriff).
   Ergänzt js/speech.js (Sprachausgabe) um die Gegenrichtung: Spracheingabe.
   Ersetzt nirgends Tippen/Antippen, sondern ist immer ein zusätzlicher Weg. */

const SpeechInput = (() => {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  function supported() {
    return !!Ctor;
  }

  function stop() {
    if (recognition) { recognition.onend = null; recognition.abort(); }
    recognition = null;
  }

  function listen({ lang = 'en-US', onResult, onError, onEnd } = {}) {
    if (!supported()) { onError?.('unsupported'); return; }
    stop();
    recognition = new Ctor();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => { onResult?.(e.results[0][0].transcript); };
    recognition.onerror = (e) => { onError?.(e.error); };
    recognition.onend = () => { recognition = null; onEnd?.(); };
    try { recognition.start(); } catch { onError?.('start-failed'); }
  }

  // Nur zum leisen Zuhören im Hintergrund (z.B. Sprachbefehl "weiter") - prüft
  // vorab, ob das Mikrofon schon erlaubt ist, statt ungefragt einen
  // Berechtigungsdialog aufpoppen zu lassen. Bricht sich selbst nach
  // `timeoutMs` ab, falls nichts erkannt wird.
  function listenIfGranted({ lang = 'en-US', onResult, timeoutMs = 6000 } = {}) {
    if (!supported() || !navigator.permissions?.query) return;
    navigator.permissions.query({ name: 'microphone' }).then(status => {
      if (status.state !== 'granted') return;
      listen({ lang, onResult });
      setTimeout(stop, timeoutMs);
    }).catch(() => {});
  }

  function errorText(err) {
    if (err === 'not-allowed' || err === 'permission-denied') return 'Mikrofonzugriff nicht erlaubt – bitte stattdessen tippen/antippen.';
    if (err === 'no-speech') return 'Nichts gehört – nochmal versuchen oder stattdessen tippen/antippen.';
    if (err === 'unsupported') return 'Dein Browser unterstützt keine Spracherkennung – bitte stattdessen tippen/antippen.';
    return 'Spracherkennung fehlgeschlagen – bitte stattdessen tippen/antippen.';
  }

  return { supported, listen, listenIfGranted, stop, errorText };
})();
