/* Einstellungen: Stimme fürs Hörverständnis wählen, Fortschritt zurücksetzen. */

Render.settings = function (root) {
  Speech.refreshVoices();
  const s = Store.get();
  const voices = Speech.listVoices();
  const currentVoiceURI = s.voiceURI || Speech.resolveVoice()?.voiceURI || '';
  const sorted = [...voices].sort((a, b) => (Speech.isHighQuality(b.name) ? 1 : 0) - (Speech.isHighQuality(a.name) ? 1 : 0));

  root.innerHTML = `
    <div class="card">
      <h3>Einstellungen</h3>
      <p class="muted">Aktueller Tag: ${Math.min(s.currentDay, 90)} von 90 · Streak: ${s.streak} Tage · ${Object.keys(s.srs).length} Wörter im Trainer</p>
    </div>

    <div class="card">
      <h3>Stimme fürs Hörverständnis</h3>
      <p class="muted">Manche Systeme bieten deutlich natürlichere Stimmen als andere. <strong>Microsoft Edge</strong> stellt kostenlose "Online (Natural)"-Stimmen bereit, die sehr menschlich klingen — mit ⭐ markiert, falls verfügbar. Klingt deine aktuelle Stimme abgehackt, probiere Edge und wähle unten eine ⭐-Stimme.</p>
      ${sorted.length === 0
        ? `<p class="muted">Keine Stimmen gefunden.</p><button class="btn ghost" id="reload-voices">Stimmen neu laden</button>`
        : `<select id="voice-select" class="field">
            ${sorted.map(v => `<option value="${v.uri}" ${v.uri === currentVoiceURI ? 'selected' : ''}>${Speech.isHighQuality(v.name) ? '⭐ ' : ''}${v.name} (${v.lang})</option>`).join('')}
          </select>`
      }
      <div style="display:flex; align-items:center; gap:14px; margin:16px 0;">
        <label class="muted" style="font-size:0.85rem; white-space:nowrap;">Sprechtempo</label>
        <input type="range" id="rate-slider" min="0.75" max="1.15" step="0.05" value="${s.speechRate}" style="flex:1;" />
      </div>
      <button class="btn" id="test-voice">🔊 Stimme testen</button>
    </div>

    <div class="card">
      <h3>Design</h3>
      <p class="muted">Drei eigenständige Oberflächen zur Wahl — nicht nur andere Farben, sondern unterschiedliche Gestaltung.</p>
      <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;">
        <button class="btn ${s.theme === 'glass' ? '' : 'ghost'}" data-theme-btn="glass">🌌 Glassmorphism</button>
        <button class="btn ${s.theme === 'aurora' ? '' : 'ghost'}" data-theme-btn="aurora">🌸 Aurora</button>
        <button class="btn ${s.theme === 'brutalist' ? '' : 'ghost'}" data-theme-btn="brutalist">◼ Brutalist</button>
      </div>
    </div>

    <div class="card">
      <h3>Hintergrund</h3>
      <p class="muted" style="font-size:0.8rem;">Video-Hintergrund ist nur im Glassmorphism-Design sichtbar.</p>
      <div style="display:flex; align-items:center; gap:14px; margin:16px 0;">
        <label class="muted" style="font-size:0.85rem; white-space:nowrap; width:230px; flex-shrink:0;">Transparenz der Kacheln</label>
        <input type="range" id="alpha-slider" min="0" max="1" step="0.05" value="${s.panelAlpha}" style="flex:1;" />
      </div>
      <div style="display:flex; align-items:center; gap:14px; margin:16px 0;">
        <label class="muted" style="font-size:0.85rem; white-space:nowrap; width:230px; flex-shrink:0;">Geschwindigkeit Hintergrundvideo</label>
        <input type="range" id="speed-slider" min="0.1" max="1" step="0.05" value="${s.bgVideoSpeed}" style="flex:1;" />
      </div>
    </div>

    <div class="card">
      <h4>Fortschritt zurücksetzen</h4>
      <p class="muted">Setzt Streak, abgeschlossene Tage und Vokabel-Fortschritt vollständig zurück. Das kann nicht rückgängig gemacht werden.</p>
      <button class="btn amber" id="reset-btn">Fortschritt zurücksetzen</button>
    </div>
  `;

  root.querySelector('#voice-select')?.addEventListener('change', (e) => {
    Store.update(st => { st.voiceURI = e.target.value; });
  });

  root.querySelector('#rate-slider')?.addEventListener('input', (e) => {
    Store.update(st => { st.speechRate = Number(e.target.value); });
  });

  root.querySelector('#alpha-slider')?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    Store.update(st => { st.panelAlpha = val; });
    applyPanelTransparency(val);
  });

  root.querySelector('#speed-slider')?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    Store.update(st => { st.bgVideoSpeed = val; });
    VideoBG.setSpeed(val);
  });

  root.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeBtn;
      Store.update(st => { st.theme = theme; });
      applyTheme(theme);
      router();
    });
  });

  root.querySelector('#reload-voices')?.addEventListener('click', () => {
    Speech.refreshVoices();
    router();
  });

  root.querySelector('#test-voice')?.addEventListener('click', () => {
    Speech.speak('Hello! This is what your listening exercises will sound like from now on.');
  });

  root.querySelector('#reset-btn').addEventListener('click', () => {
    if (confirm('Wirklich den gesamten Fortschritt zurücksetzen?')) {
      Store.reset();
      window.location.hash = '#/dashboard';
      router();
    }
  });
};
