/* Dynamischer Video-Hintergrund: rendert die Clips aus ./Videomaterial/ per WebGL
   auf ein vollflächiges <canvas>. Das Video wird dabei per Shader geschärft
   (Unsharp-Mask-Kernel), damit das Hochskalieren der Hochformat-Quellen auf
   Breitbild nicht so weich wirkt wie ein reines CSS object-fit: cover.
   Volle Bildschirmabdeckung bleibt erhalten (Cover-Zuschnitt passiert im Shader).
   Fällt automatisch auf ein einfaches CSS-Cover-Video zurück, falls WebGL nicht
   verfügbar ist ODER der Browser die lokalen Videos aus Sicherheitsgründen als
   "Cross-Origin" behandelt (passiert z. B. beim Öffnen per Doppelklick über
   file:// statt über einen Server/GitHub Pages — dort verweigert der Browser
   das Auslesen der Videodaten für WebGL-Texturen).
   Geschwindigkeit ist live über VideoBG.setSpeed() steuerbar (siehe Einstellungen). */
const VideoBG = (function () {
  const VIDEOS = [
    'Videomaterial/' + encodeURIComponent('No Copyright Video, Background, Green Screen, Motion Graphics, Animated Background, Copyright Free.mp4')
  ];

  let playbackRate = (typeof Store !== 'undefined' && Store.get().bgVideoSpeed) || 0.4;

  const canvas = document.getElementById('bg-canvas');
  const [videoA, videoB] = document.querySelectorAll('.bg-video-src');
  if (!canvas || !videoA || !videoB) return { setSpeed() {} };

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

  function playVideo(video, src) {
    video.src = src;
    video.currentTime = 0;
    video.playbackRate = playbackRate;
    video.play().catch(() => {});
  }

  let fallbackApi = null;
  function startCssFallback() {
    if (fallbackApi) return fallbackApi;
    canvas.style.display = 'none';
    [videoA, videoB].forEach(v => {
      v.classList.remove('bg-video-src');
      v.classList.add('bg-video-fallback');
    });
    let front = videoA, back = videoB;
    playVideo(front, nextSrc());
    front.classList.add('active');
    if (VIDEOS.length > 1) {
      setInterval(() => {
        playVideo(back, nextSrc());
        back.classList.add('active');
        front.classList.remove('active');
        [front, back] = [back, front];
      }, 7000);
    } else {
      front.loop = true;
    }
    fallbackApi = {
      setSpeed(rate) {
        playbackRate = rate;
        [videoA, videoB].forEach(v => { v.playbackRate = rate; });
      }
    };
    return fallbackApi;
  }

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return startCssFallback();

  const vsSource = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;
  const fsSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexA;
    uniform sampler2D uTexB;
    uniform vec4 uXformA;
    uniform vec4 uXformB;
    uniform vec2 uTexelA;
    uniform vec2 uTexelB;
    uniform float uMix;

    vec3 sharpen(sampler2D tex, vec2 uv, vec2 texel) {
      vec3 c = texture2D(tex, uv).rgb;
      vec3 n = texture2D(tex, uv + vec2(0.0, -texel.y)).rgb;
      vec3 s = texture2D(tex, uv + vec2(0.0,  texel.y)).rgb;
      vec3 e = texture2D(tex, uv + vec2(texel.x, 0.0)).rgb;
      vec3 w = texture2D(tex, uv + vec2(-texel.x, 0.0)).rgb;
      return clamp(c * 3.0 - (n + s + e + w) * 0.5, 0.0, 1.0);
    }

    void main() {
      vec2 uvA = clamp(vUv * uXformA.xy + uXformA.zw, 0.0, 1.0);
      vec2 uvB = clamp(vUv * uXformB.xy + uXformB.zw, 0.0, 1.0);
      vec3 col;
      if (uMix <= 0.0) {
        col = sharpen(uTexA, uvA, uTexelA);
      } else if (uMix >= 1.0) {
        col = sharpen(uTexB, uvB, uTexelB);
      } else {
        col = mix(sharpen(uTexA, uvA, uTexelA), sharpen(uTexB, uvB, uTexelB), uMix);
      }
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uXformA = gl.getUniformLocation(prog, 'uXformA');
  const uXformB = gl.getUniformLocation(prog, 'uXformB');
  const uTexelA = gl.getUniformLocation(prog, 'uTexelA');
  const uTexelB = gl.getUniformLocation(prog, 'uTexelB');
  const uMixLoc = gl.getUniformLocation(prog, 'uMix');
  const uTexALoc = gl.getUniformLocation(prog, 'uTexA');
  const uTexBLoc = gl.getUniformLocation(prog, 'uTexB');

  function makeTexture() {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return tex;
  }
  const texA = makeTexture();
  const texB = makeTexture();

  const dimsA = { w: 0, h: 0 };
  const dimsB = { w: 0, h: 0 };
  videoA.addEventListener('loadedmetadata', () => { dimsA.w = videoA.videoWidth; dimsA.h = videoA.videoHeight; });
  videoB.addEventListener('loadedmetadata', () => { dimsB.w = videoB.videoWidth; dimsB.h = videoB.videoHeight; });

  function coverXform(videoW, videoH, canvasW, canvasH) {
    if (!videoW || !videoH) return [1, 1, 0, 0];
    const arCanvas = canvasW / canvasH;
    const arVideo = videoW / videoH;
    let sx = 1, sy = 1;
    if (arCanvas > arVideo) { sy = arVideo / arCanvas; } else { sx = arCanvas / arVideo; }
    return [sx, sy, 0.5 - 0.5 * sx, 0.5 - 0.5 * sy];
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  let front = videoA, back = videoB;
  let activeIsA = true;
  let mix = 0;
  let animStart = 0, animFrom = 0, animTo = 0, animDuration = 0;
  let stopped = false;

  playVideo(front, nextSrc());
  if (VIDEOS.length <= 1) front.loop = true;

  function swap() {
    if (stopped) return;
    playVideo(back, nextSrc());
    animFrom = mix;
    animTo = activeIsA ? 1 : 0;
    animStart = performance.now();
    animDuration = 1800;
    activeIsA = !activeIsA;
    [front, back] = [back, front];
  }
  const swapTimer = VIDEOS.length > 1 ? setInterval(swap, 7000) : null;

  function render(now) {
    if (stopped) return;
    if (canvas.offsetParent === null) { requestAnimationFrame(render); return; }
    try {
      if (animDuration > 0) {
        const t = Math.min(1, (now - animStart) / animDuration);
        mix = animFrom + (animTo - animFrom) * t;
        if (t >= 1) animDuration = 0;
      }
      if (videoA.readyState >= videoA.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, texA);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, videoA);
      }
      if (videoB.readyState >= videoB.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, texB);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, videoB);
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.uniform1i(uTexALoc, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texB);
      gl.uniform1i(uTexBLoc, 1);

      const xa = coverXform(dimsA.w, dimsA.h, canvas.width, canvas.height);
      const xb = coverXform(dimsB.w, dimsB.h, canvas.width, canvas.height);
      gl.uniform4f(uXformA, xa[0], xa[1], xa[2], xa[3]);
      gl.uniform4f(uXformB, xb[0], xb[1], xb[2], xb[3]);
      gl.uniform2f(uTexelA, dimsA.w ? 1 / dimsA.w : 0, dimsA.h ? 1 / dimsA.h : 0);
      gl.uniform2f(uTexelB, dimsB.w ? 1 / dimsB.w : 0, dimsB.h ? 1 / dimsB.h : 0);
      gl.uniform1f(uMixLoc, mix);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } catch (err) {
      /* Tritt z. B. bei file://-Zugriff auf: Browser verweigert das Auslesen
         lokaler Videodateien für WebGL-Texturen ("tainted canvas"). */
      stopped = true;
      clearInterval(swapTimer);
      startCssFallback();
      return;
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  return {
    setSpeed(rate) {
      playbackRate = rate;
      [videoA, videoB].forEach(v => { v.playbackRate = rate; });
      if (fallbackApi) fallbackApi.setSpeed(rate);
    }
  };
})();
