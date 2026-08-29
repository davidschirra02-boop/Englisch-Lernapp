/* Motivations-Video-Popup: eigenständige, wiederverwendbare Komponente.
   Wird sowohl automatisch (Kapitelstart/-abschluss, siehe js/render/lesson.js)
   als auch manuell (Motivation-Tab, js/render/motivation.js) aufgerufen.
   Es gibt sonst kein Modal/Overlay-System in der App - dieses Popup hängt sich
   direkt an document.body, damit es garantiert über allem liegt (inkl.
   #bg-video-layer aus js/videobg.js). */

const MOTIVATION_VIDEOS = {
  intro: { title: 'Zum Start', src: 'Videomaterial/' + encodeURIComponent('Jim Rohn Anfangsclip.mp4') },
  outro: { title: 'Zum Abschluss', src: 'Videomaterial/' + encodeURIComponent('Jim Rohn Endclip 2.mp4') },
  bonus: { title: 'Extra-Motivation', src: 'Videomaterial/' + encodeURIComponent('Jim Rohn Endclip.mp4') }
};

const VideoPopup = {
  // Aufräumfunktion des aktuell offenen Popups (falls eins offen ist) - wird
  // von close() UND von einem neuen show()-Aufruf genutzt, damit der
  // Tastatur-Listener des vorherigen Popups nie hängen bleibt (sonst
  // sammeln sich bei mehrfachem Öffnen mehrere document-Listener an).
  _activeCleanup: null,

  close() {
    VideoPopup._activeCleanup?.();
  },

  show(src) {
    VideoPopup.close();
    const overlay = document.createElement('div');
    overlay.className = 'video-popup-overlay';
    overlay.innerHTML = `
      <div class="video-popup">
        <button type="button" class="video-popup-close" aria-label="Schließen">✕</button>
        <video src="${src}" autoplay controls playsinline preload="auto"></video>
      </div>`;
    document.body.appendChild(overlay);

    const video = overlay.querySelector('video');

    function close() {
      video.pause();
      document.removeEventListener('keydown', onKeydown, true);
      overlay.remove();
      VideoPopup._activeCleanup = null;
    }
    VideoPopup._activeCleanup = close;
    // Capture-Phase + stopPropagation, damit die nativen Tastatur-Kurzbefehle
    // des <video controls>-Elements selbst (das auf Pfeiltasten ebenfalls
    // mit eigenem Vor-/Zurückspulen reagiert und sich sonst mit der Logik
    // hier unten in die Quere kommt) den Tastendruck gar nicht erst sehen.
    function onKeydown(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        e.stopPropagation();
        video.paused ? video.play() : video.pause();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - 5);
      }
    }

    overlay.querySelector('.video-popup-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    video.addEventListener('ended', close);
    document.addEventListener('keydown', onKeydown, true);

    // Manche Browser ignorieren das autoplay-Attribut in bestimmten
    // Situationen stillschweigend - expliziter play()-Aufruf, damit ein
    // etwaiger Autoplay-Block wenigstens im Log sichtbar wird, statt dass
    // das Video einfach lautlos stehen bleibt.
    video.play().catch(err => console.warn('Video-Autoplay blockiert:', err));
  }
};
