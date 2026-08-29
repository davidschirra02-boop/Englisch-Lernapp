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
  show(src) {
    const overlay = document.createElement('div');
    overlay.className = 'video-popup-overlay';
    overlay.innerHTML = `
      <div class="video-popup">
        <button type="button" class="video-popup-close" aria-label="Schließen">✕</button>
        <video src="${src}" autoplay controls playsinline></video>
      </div>`;
    document.body.appendChild(overlay);

    const video = overlay.querySelector('video');

    function close() {
      video.pause();
      document.removeEventListener('keydown', onKeydown);
      overlay.remove();
    }
    function onKeydown(e) {
      if (e.key === 'Escape') close();
    }

    overlay.querySelector('.video-popup-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    video.addEventListener('ended', close);
    document.addEventListener('keydown', onKeydown);
  }
};
