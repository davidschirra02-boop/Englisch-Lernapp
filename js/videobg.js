/* Dynamischer Video-Hintergrund: crossfadet zwischen allen Clips in ./Videomaterial/.
   Geschwindigkeit ist live über VideoBG.setSpeed() steuerbar (siehe Einstellungen). */
const VideoBG = (function () {
  const VIDEOS = [
    'Videomaterial/SnapInsta.to_AQMFs33q_nygh9EXHDwzNze1PuFeJLe-GYiD7AHyNffTZUpTTZvDCw2vGUyJ8Tfj4bCnkE67FpEtQjjf0i7GJ0gMwB-FpGgqcJZx8Xk.mp4',
    'Videomaterial/SnapInsta.to_AQNk0Xu9GlQqLn9Veh1Dkfp2YmYz5zajj7fRpb8J6eXmp5fAHYr1wnghDn4ovpWpu4xZ9e40XuMFHX1P2rkNviI0dKGeQXefJti3zlE.mp4',
    'Videomaterial/SnapInsta.to_AQOthHpXZYPJiV3dmY8kl_trHBH-66C0xqoCcMlkYB3S8bJuU4jbQmbhrr0t-bA-ipdCfOMdxgFIOKwf6O58LYOL2G7EFbwl-S1wpy8.mp4',
    'Videomaterial/SnapInsta.to_AQOUMetAXVq4GVnQvRbj0S5q_cOXZDt0ZDT5LDAPOJA-PfbLm6Ib-IbgtVquYuX1ASAoGXvQMBqLUgvIWE-dDNNdm2aEjoCmwl3BSAQ.mp4'
  ];

  let playbackRate = (typeof Store !== 'undefined' && Store.get().bgVideoSpeed) || 0.4;

  const [videoA, videoB] = document.querySelectorAll('#bg-video-layer .bg-video');
  if (!videoA || !videoB) return { setSpeed() {} };

  function shuffled() {
    const a = VIDEOS.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let queue = shuffled();
  let qi = 0;
  function nextSrc() {
    if (qi >= queue.length) { queue = shuffled(); qi = 0; }
    return queue[qi++];
  }

  function play(video, src) {
    video.src = src;
    video.currentTime = 0;
    video.playbackRate = playbackRate;
    video.play().catch(() => {});
  }

  [videoA, videoB].forEach(v => {
    v.addEventListener('loadedmetadata', () => { v.playbackRate = playbackRate; });
  });

  let front = videoA, back = videoB;
  play(front, nextSrc());
  front.classList.add('active');

  function swap() {
    play(back, nextSrc());
    back.classList.add('active');
    front.classList.remove('active');
    [front, back] = [back, front];
  }

  setInterval(swap, 7000);

  function setSpeed(rate) {
    playbackRate = rate;
    [videoA, videoB].forEach(v => { v.playbackRate = rate; });
  }

  return { setSpeed };
})();
