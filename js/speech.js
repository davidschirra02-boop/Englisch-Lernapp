/* Wrapper um die browsereigene Web Speech API (kostenlos, kein API-Key).
   Wählt automatisch die natürlichste verfügbare Stimme per Bewertung aus
   (bevorzugt Cloud-/"Natural"-Neural-Stimmen wie Microsoft Edge sie kostenlos
   bereitstellt) und lässt den Nutzer in den Einstellungen manuell wählen. */

const Speech = (() => {
  let voices = [];
  let autoVoice = null;

  const QUALITY_HINTS = ['natural', 'online', 'neural', 'premium'];
  const MALE_NAME_HINTS = ['guy', 'ryan', 'christopher', 'david', 'mark', 'daniel', 'george', 'thomas', 'william', 'james', 'matthew', 'brian', 'eric', 'paul'];

  function isHighQuality(name) {
    const n = name.toLowerCase();
    return QUALITY_HINTS.some(h => n.includes(h));
  }

  function score(v) {
    const name = v.name.toLowerCase();
    let s = 0;
    QUALITY_HINTS.forEach(h => { if (name.includes(h)) s += 50; });
    MALE_NAME_HINTS.forEach(h => { if (name.includes(h)) s += 20; });
    if (v.lang === 'en-GB') s += 8;
    else if (v.lang === 'en-US') s += 6;
    else if (v.lang?.startsWith('en')) s += 3;
    if (v.localService === false) s += 5;
    return s;
  }

  function refreshVoices() {
    if (!('speechSynthesis' in window)) return;
    voices = window.speechSynthesis.getVoices().filter(v => v.lang?.toLowerCase().startsWith('en'));
    autoVoice = voices.length ? [...voices].sort((a, b) => score(b) - score(a))[0] : null;
  }

  if ('speechSynthesis' in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function supported() {
    return 'speechSynthesis' in window;
  }

  function listVoices() {
    return voices.map(v => ({ uri: v.voiceURI, name: v.name, lang: v.lang }));
  }

  function resolveVoice() {
    const s = Store.get();
    if (s.voiceURI) {
      const chosen = voices.find(v => v.voiceURI === s.voiceURI);
      if (chosen) return chosen;
    }
    return autoVoice;
  }

  function speak(text, { onEnd } = {}) {
    if (!supported()) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = resolveVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-GB'; }
    u.rate = Store.get().speechRate || 0.95;
    u.pitch = 1.0;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  }

  function wireSpeakButton(btn, text) {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.speak-btn.speaking').forEach(b => { if (b !== btn) b.classList.remove('speaking'); });
      btn.classList.add('speaking');
      speak(text, { onEnd: () => btn.classList.remove('speaking') });
    });
  }

  return { supported, listVoices, resolveVoice, refreshVoices, isHighQuality, speak, wireSpeakButton };
})();
