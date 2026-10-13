/**
 * Framer 3D Spatial Gallery Component Engine
 * Adapted from the official Framer Marketplace 3D SpatialGallery WebGL Component (by Grids & Giggles)
 * Supports: Infinite depth loop, shader-drawn rounded corners, video hover playback,
 * ring/spiral layout, hollow center, mouse parallax, drag to travel, auto-drift, and reduced motion.
 */

(function (global) {
  'use strict';

  // Math helpers
  const TWO_PI = Math.PI * 2;
  const clamp = (val, min, max) => (val < min ? min : val > max ? max : val);
  
  // Deterministic pseudo-random generator
  function hash(e, t) {
    const n = Math.sin(e * 127.1 + t * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }

  function isVideoUrl(url) {
    return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url || '');
  }

  function createMat4() {
    return new Float32Array(16);
  }

  // Perspective matrix (fov in degrees, aspect, near, far)
  function perspectiveMat4(out, fov, aspect, near, far) {
    const f = 1 / Math.tan((fov * Math.PI) / 360);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) / (near - far);
    out[15] = 0;
    return out;
  }

  // 4x4 Matrix multiplication: out = a * b
  function multiplyMat4(out, a, b) {
    for (let r = 0; r < 4; r++) {
      const b0 = b[r * 4];
      const b1 = b[r * 4 + 1];
      const b2 = b[r * 4 + 2];
      const b3 = b[r * 4 + 3];
      out[r * 4]     = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
      out[r * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
      out[r * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
      out[r * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
    }
    return out;
  }

  // Shaders
  const VERTEX_SHADER = `
    attribute vec2 aPos;
    attribute vec2 aUv;
    uniform mat4 uMVP;
    varying vec2 vUv;
    void main() {
        vUv = aUv;
        gl_Position = uMVP * vec4(aPos, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    varying vec2 vUv;
    uniform sampler2D uMap;
    uniform vec2 uRepeat;
    uniform vec2 uOffset;
    uniform float uOpacity;
    uniform float uRadius;
    uniform float uAspect;
    uniform float uHasMap;

    float roundedMask(vec2 uv, float r, float aspect) {
        vec2 p = vec2(uv.x * aspect, uv.y);
        vec2 halfSize = vec2(aspect, 1.0) * 0.5;
        vec2 c = p - halfSize;
        vec2 q = abs(c) - (halfSize - vec2(r));
        float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
        return 1.0 - smoothstep(-0.004, 0.004, d);
    }

    void main() {
        vec2 uv = vUv * uRepeat + uOffset;
        vec4 sampled = texture2D(uMap, uv);
        vec4 tex = mix(vec4(0.93, 0.95, 0.97, 1.0), sampled, uHasMap);
        float mask = roundedMask(vUv, uRadius, uAspect);
        float a = tex.a * uOpacity * mask;
        if (a <= 0.001) discard;
        gl_FragColor = vec4(tex.rgb, a);
    }
  `;

  function initSpatialGallery(container, userOptions) {
    if (!container) return null;

    const options = Object.assign({
      items: [],
      background: 'transparent',
      objectWidth: 5.0,
      objectHeight: 3.6,
      objectFit: 'contain',
      radius: 0.14,
      facing: 'funnel',
      funnelAmount: 0.96,
      particleCount: 200,
      hollowCenter: 2.0,
      spread: 3.6,
      verticalSquash: 0.9,
      scrollCapture: false,
      scrollSpeed: 1.6,
      dragToMove: true,
      depthRange: 72,
      spiralMotion: true,
      spiralTurns: 1,
      spiralRadius: 3.6,
      helixSpin: 0.014,
      autoMotion: true,
      autoSpeed: 1.0,
      autoDirection: 'forward',
      mouseInteraction: true,
      mouseSensitivity: 0.65,
      linkTarget: 'same',
      reducedMotion: true
    }, userOptions);

    const items = (options.items || []).filter(item => item && (item.url || item.poster || item.src));
    if (items.length === 0) return null;

    // Check reduced motion
    const prefersReducedMotion = options.reducedMotion &&
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'spatial-gallery-canvas';
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'auto';
    container.appendChild(canvas);

    const glAttribs = {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    };

    const gl = canvas.getContext('webgl', glAttribs) || canvas.getContext('experimental-webgl', glAttribs);
    if (!gl) {
      console.warn('WebGL not supported for 3D Spatial Gallery');
      return null;
    }

    // Compile shaders
    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return null;
    }
    gl.useProgram(program);

    // Uniform and attribute locations
    const aPosLoc = gl.getAttribLocation(program, 'aPos');
    const aUvLoc = gl.getAttribLocation(program, 'aUv');
    const uMVPLoc = gl.getUniformLocation(program, 'uMVP');
    const uMapLoc = gl.getUniformLocation(program, 'uMap');
    const uRepeatLoc = gl.getUniformLocation(program, 'uRepeat');
    const uOffsetLoc = gl.getUniformLocation(program, 'uOffset');
    const uOpacityLoc = gl.getUniformLocation(program, 'uOpacity');
    const uRadiusLoc = gl.getUniformLocation(program, 'uRadius');
    const uAspectLoc = gl.getUniformLocation(program, 'uAspect');
    const uHasMapLoc = gl.getUniformLocation(program, 'uHasMap');

    // Quad geometry (unit quad centered at origin)
    const quadVertices = new Float32Array([
      -0.5, -0.5, 0, 0,
       0.5, -0.5, 1, 0,
      -0.5,  0.5, 0, 1,
       0.5,  0.5, 1, 1
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(aUvLoc);
    gl.vertexAttribPointer(aUvLoc, 2, gl.FLOAT, false, 16, 8);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.uniform1i(uMapLoc, 0);
    gl.activeTexture(gl.TEXTURE0);

    // Default 1x1 placeholder texture (soft light neutral)
    const placeholderTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, placeholderTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([241, 245, 249, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    function isPowerOf2(value) {
      return (value & (value - 1)) === 0;
    }

    function createTexture() {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return tex;
    }

    const objAspect = options.objectWidth / options.objectHeight;
    const cornerRadius = clamp(options.radius / Math.min(options.objectWidth, options.objectHeight), 0, 0.5);
    gl.uniform1f(uRadiusLoc, cornerRadius);
    gl.uniform1f(uAspectLoc, objAspect);

    const imageCache = new Map();
    const pendingLoads = new Map();
    const uploadQueue = [];
    const videoCache = new Map();
    let isDestroyed = false;

    function computeUVMapping(plane, w, h) {
      if (!w || !h) return;
      plane.texW = w;
      plane.texH = h;
      const aspect = w / h;
      if (options.objectFit === 'cover') {
        let rX = 1;
        let rY = 1;
        if (aspect > objAspect) {
          rX = objAspect / aspect;
        } else {
          rY = aspect / objAspect;
        }
        plane.repeatX = rX;
        plane.repeatY = rY;
        plane.offsetX = (1 - rX) / 2;
        plane.offsetY = (1 - rY) / 2;
        plane.scaleX = 1;
        plane.scaleY = 1;
      } else {
        plane.repeatX = 1;
        plane.repeatY = 1;
        plane.offsetX = 0;
        plane.offsetY = 0;
        if (aspect > objAspect) {
          plane.scaleX = 1;
          plane.scaleY = objAspect / aspect;
        } else {
          plane.scaleX = aspect / objAspect;
          plane.scaleY = 1;
        }
      }
      updatePlaneModelScale(plane);
    }

    function updatePlaneModelScale(p) {
      const w = options.objectWidth * p.scaleX;
      const h = options.objectHeight * p.scaleY;
      const m = p.model;
      m[0]  = p.ax[0] * w; m[1]  = p.ax[1] * w; m[2]  = p.ax[2] * w; m[3]  = 0;
      m[4]  = p.ay[0] * h; m[5]  = p.ay[1] * h; m[6]  = p.ay[2] * h; m[7]  = 0;
      m[8]  = p.az[0];     m[9]  = p.az[1];     m[10] = p.az[2];     m[11] = 0;
      m[12] = p.x;         m[13] = p.y;         m[14] = p.z;         m[15] = 1;
    }

    function computePlaneBasis(p, isFront, cosF, sinF) {
      let azX = 0, azY = 0, azZ = 1;
      if (!isFront) {
        const invX = -p.x;
        const invY = -p.y;
        const hyp = Math.hypot(invX, invY);
        if (hyp > 1e-4) {
          azX = (invX / hyp) * cosF;
          azY = (invY / hyp) * cosF;
          azZ = sinF;
          const len = Math.hypot(azX, azY, azZ) || 1;
          azX /= len; azY /= len; azZ /= len;
        }
      }
      if (azX === 0 && azZ === 0) azX = 1e-4;

      let axX = azZ, axY = 0, axZ = -azX;
      const axLen = Math.hypot(axX, axY, axZ) || 1;
      axX /= axLen; axY /= axLen; axZ /= axLen;

      const ayX = azY * axZ - azZ * axY;
      const ayY = azZ * axX - azX * axZ;
      const ayZ = axX * axY - azY * axX;

      p.ax[0] = axX; p.ax[1] = axY; p.ax[2] = axZ;
      p.ay[0] = ayX; p.ay[1] = ayY; p.ay[2] = ayZ;
      p.az[0] = azX; p.az[1] = azY; p.az[2] = azZ;
      updatePlaneModelScale(p);
    }

    function loadPoster(plane) {
      const src = plane.posterSrc;
      if (!src) return;

      // 1. Already uploaded to GPU
      const cached = imageCache.get(src);
      if (cached) {
        plane.posterTex = cached.tex;
        plane.tex = cached.tex;
        plane.hasMap = 1;
        computeUVMapping(plane, cached.w, cached.h);
        return;
      }

      // 2. Already downloading/decoding — attach to waiting list (prevents duplicate decodes!)
      const waiting = pendingLoads.get(src);
      if (waiting) {
        waiting.push(plane);
        return;
      }

      pendingLoads.set(src, [plane]);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => {
        if (isDestroyed) return;
        uploadQueue.push({ src, img });
      };
      img.onerror = () => {
        pendingLoads.delete(src);
      };
      img.src = src;
    }

    function processTextureUploads() {
      // Upload at most 3 textures per frame so gl.texImage2D never stalls a frame
      let count = 0;
      while (uploadQueue.length > 0 && count < 3) {
        const { src, img } = uploadQueue.shift();
        const tex = createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        if (isPowerOf2(img.naturalWidth) && isPowerOf2(img.naturalHeight)) {
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        const data = { tex, w: img.naturalWidth, h: img.naturalHeight };
        imageCache.set(src, data);

        const waitingPlanes = pendingLoads.get(src) || [];
        pendingLoads.delete(src);
        for (let i = 0; i < waitingPlanes.length; i++) {
          const p = waitingPlanes[i];
          p.posterTex = tex;
          if (!p.playing) {
            p.tex = tex;
            p.hasMap = 1;
            computeUVMapping(p, data.w, data.h);
          }
        }
        count++;
      }
    }

    function getVideoEntry(plane) {
      const src = plane.videoSrc;
      if (!src) return null;
      let cached = videoCache.get(src);
      if (cached) return cached;

      const video = document.createElement('video');
      video.src = src;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');

      const entry = { el: video, tex: createTexture() };
      videoCache.set(src, entry);
      return entry;
    }

    // Generate planes in Golden-Angle 3D spatial helix layout (matching beforeafter.framer.website/spiral)
    const count = Math.max(1, Math.round(options.particleCount));
    const planes = [];
    const minR = options.objectWidth * options.hollowCenter;
    const maxR = minR + options.objectWidth * options.spread;
    const GOLDEN_ANGLE = 2.399963229728653; // pi * (3 - sqrt(5))
    const NEAR_CUT = 4;
    const totalDepthSpan = options.depthRange + NEAR_CUT;
    const initIsFront = options.facing === 'front';
    const initFunnelRad = (1 - clamp(options.funnelAmount, 0, 1)) * Math.PI * 0.5;
    const initCosF = Math.cos(initFunnelRad);
    const initSinF = Math.sin(initFunnelRad);

    for (let i = 0; i < count; i++) {
      const item = items[i % items.length];
      const rawUrl = item.url || item.src || item.file || '';
      const poster = item.poster || (isVideoUrl(rawUrl) ? '' : rawUrl);
      const angle = (i * GOLDEN_ANGLE + (hash(i, 1) - 0.5) * 0.22) % TWO_PI;
      const r = minR + Math.sqrt(hash(i, 2)) * (maxR - minR);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r * options.verticalSquash;
      const z = NEAR_CUT - totalDepthSpan * ((i + 0.5) / count);

      const plane = {
        index: i,
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseR: r,
        scaleX: 1,
        scaleY: 1,
        repeatX: 1,
        repeatY: 1,
        offsetX: 0,
        offsetY: 0,
        opacity: 0,
        hasMap: 0,
        tex: null,
        texW: 0,
        texH: 0,
        ax: [1, 0, 0],
        ay: [0, 1, 0],
        az: [0, 0, 1],
        model: createMat4(),
        mvp: createMat4(),
        videoSrc: isVideoUrl(rawUrl) ? rawUrl : '',
        imageSrc: isVideoUrl(rawUrl) ? '' : rawUrl,
        posterSrc: poster || (isVideoUrl(rawUrl) ? '' : rawUrl),
        link: item.link || '',
        alt: item.alt || '',
        playing: false,
        posterTex: null,
        spiralAngle: angle,
        spiralJitter: hash(i, 4)
      };

      computePlaneBasis(plane, initIsFront, initCosF, initSinF);
      planes.push(plane);
      loadPoster(plane);
    }

    const sortedPlanes = planes.slice();

    // Interaction state
    let targetTravel = 0;
    let currentTravel = 0;
    let prevTravel = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let isDragging = false;
    let dragStartY = 0;
    let dragDist = 0;
    let hoveredPlane = null;
    let isHoveringInside = false;
    let isContextLost = false;
    let isVisible = true;
    let isIntersecting = true;
    let touchStartY = 0;

    // Events
    function onWheel(e) {
      if (options.scrollCapture) {
        e.preventDefault();
        targetTravel += e.deltaY * options.scrollSpeed * 0.01;
      }
    }

    function onTouchStart(e) {
      touchStartY = e.touches[0] ? e.touches[0].clientY : 0;
    }

    function onTouchMove(e) {
      if (!options.scrollCapture && !options.dragToMove) return;
      const y = e.touches[0] ? e.touches[0].clientY : 0;
      targetTravel += (touchStartY - y) * options.scrollSpeed * 0.03;
      touchStartY = y;
    }

    function onPointerDown(e) {
      if (options.dragToMove && e.pointerType !== 'touch') {
        isDragging = true;
        dragDist = 0;
        dragStartY = e.clientY;
        container.style.cursor = 'grabbing';
        try { container.setPointerCapture(e.pointerId); } catch(err) {}
      }
    }

    function onPointerUp(e) {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = hoveredPlane && hoveredPlane.link ? 'pointer' : 'grab';
        try { container.releasePointerCapture(e.pointerId); } catch(err) {}
      }
    }

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
        targetPointerX = nx * 2 - 1;
        targetPointerY = -(ny * 2 - 1);
        isHoveringInside = true;
      }

      if (isDragging) {
        const dy = dragStartY - e.clientY;
        dragDist += Math.abs(dy);
        targetTravel += dy * options.scrollSpeed * 0.04;
        dragStartY = e.clientY;
      }
    }

    function onPointerLeave() {
      isHoveringInside = false;
      targetPointerX = 0;
      targetPointerY = 0;
    }

    function onClick() {
      if (dragDist > 8) return; // Prevent click firing after drag
      if (hoveredPlane && hoveredPlane.link) {
        if (hoveredPlane.link.startsWith('#')) {
          const targetEl = document.querySelector(hoveredPlane.link);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (options.linkTarget === 'new') {
          window.open(hoveredPlane.link, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = hoveredPlane.link;
        }
      }
    }

    container.addEventListener('wheel', onWheel, { passive: !options.scrollCapture });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('click', onClick);

    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); isContextLost = true; });
    canvas.addEventListener('webglcontextrestored', () => { isContextLost = false; });

    function playPlaneVideo(plane) {
      const entry = getVideoEntry(plane);
      if (!entry) return;
      plane.playing = true;
      const p = entry.el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      if (entry.el.videoWidth && entry.el.videoHeight) {
        computeUVMapping(plane, entry.el.videoWidth, entry.el.videoHeight);
      } else {
        entry.el.addEventListener('loadedmetadata', () => {
          computeUVMapping(plane, entry.el.videoWidth, entry.el.videoHeight);
        }, { once: true });
      }
    }

    function pausePlaneVideo(plane) {
      plane.playing = false;
      const entry = videoCache.get(plane.videoSrc);
      if (entry) entry.el.pause();
      if (plane.posterTex) {
        plane.tex = plane.posterTex;
        plane.hasMap = 1;
        const cached = imageCache.get(plane.posterSrc);
        if (cached) computeUVMapping(plane, cached.w, cached.h);
      } else {
        plane.tex = null;
        plane.hasMap = 0;
      }
    }

    // Cameras and matrices
    const projMat = createMat4();
    const camMat = createMat4();
    const viewProjMat = createMat4();
    let aspect = 1;

    function resize() {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = w / h;
      perspectiveMat4(projMat, 55, aspect, 0.1, options.depthRange + 60);
    }

    window.addEventListener('resize', resize);
    resize();

    // Intersection & Visibility Observers
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        isIntersecting = entries[0] ? entries[0].isIntersecting : true;
        if (!isIntersecting) {
          videoCache.forEach(v => v.el.pause());
        }
      }, { threshold: 0.05 });
      io.observe(container);
    }

    document.addEventListener('visibilitychange', () => {
      isVisible = document.visibilityState !== 'hidden';
      if (!isVisible) videoCache.forEach(v => v.el.pause());
    });

    let animationFrameId = 0;
    let lastTime = performance.now();
    let smoothDelta = 1.0;

    function renderLoop(currentTime) {
      animationFrameId = requestAnimationFrame(renderLoop);
      const rawDelta = Math.min(Math.max((currentTime - lastTime) / 16.667, 0.25), 2.0);
      lastTime = currentTime;
      smoothDelta += (rawDelta - smoothDelta) * 0.12;

      if (!isIntersecting || !isVisible || isContextLost) return;

      // Staggered texture uploads (max 3 per frame for zero frame drops)
      if (uploadQueue.length > 0) {
        processTextureUploads();
      }

      // Auto drift (faster, fluid and responsive drift)
      if (options.autoMotion && !prefersReducedMotion) {
        const dir = options.autoDirection === 'backward' ? -1 : 1;
        targetTravel += options.autoSpeed * dir * 0.082 * smoothDelta;
      }

      const travelLerp = 1 - Math.exp(-0.088 * smoothDelta);
      currentTravel += (targetTravel - currentTravel) * travelLerp;
      const travelDelta = currentTravel - prevTravel;
      prevTravel = currentTravel;

      const depthRange = options.depthRange;
      const totalSpan = depthRange + NEAR_CUT;
      const invFadeIn = 1 / (depthRange * 0.35);

      // Smooth pointer tracking
      const pointerLerp = 1 - Math.exp(-0.045 * smoothDelta);
      if (options.mouseInteraction && isHoveringInside) {
        const sens = options.mouseSensitivity;
        smoothPointerX += (targetPointerX * sens - smoothPointerX) * pointerLerp;
        smoothPointerY += (targetPointerY * sens - smoothPointerY) * pointerLerp;
      } else {
        smoothPointerX += (0 - smoothPointerX) * pointerLerp;
        smoothPointerY += (0 - smoothPointerY) * pointerLerp;
      }

      const camPosX = -smoothPointerX;
      const camPosY = -smoothPointerY;
      const camRotY = smoothPointerX * 0.02;
      const camRotX = smoothPointerY * 0.02;

      const cosRX = Math.cos(camRotX), sinRX = Math.sin(camRotX);
      const cosRY = Math.cos(camRotY), sinRY = Math.sin(camRotY);

      const m0 = cosRY,           m1 = 0,     m2 = sinRY;
      const m4 = sinRX * sinRY,   m5 = cosRX, m6 = -sinRX * cosRY;
      const m8 = -cosRX * sinRY,  m9 = sinRX, m10 = cosRX * cosRY;

      camMat[0] = m0; camMat[1] = m1; camMat[2] = m2;   camMat[3] = 0;
      camMat[4] = m4; camMat[5] = m5; camMat[6] = m6;   camMat[7] = 0;
      camMat[8] = m8; camMat[9] = m9; camMat[10] = m10; camMat[11] = 0;
      camMat[12] = 0; camMat[13] = 0; camMat[14] = 0;   camMat[15] = 1;

      multiplyMat4(viewProjMat, projMat, camMat);

      // Update Z positions, opacity, and MVP matrices
      for (let i = 0; i < planes.length; i++) {
        const p = planes[i];
        p.z += travelDelta;
        if (p.z > NEAR_CUT) {
          p.z -= totalSpan;
        } else if (p.z < -depthRange) {
          p.z += totalSpan;
        }

        const zPos = p.z;
        p.opacity = clamp((zPos + depthRange) * invFadeIn, 0, 1) * clamp((NEAR_CUT - zPos) * 0.16667, 0, 1);

        p.model[12] = p.x + camPosX;
        p.model[13] = p.y + camPosY;
        p.model[14] = zPos;
        multiplyMat4(p.mvp, viewProjMat, p.model);
      }

      // Raycast hit testing for hover
      if (isHoveringInside && Math.abs(targetPointerX) <= 1 && Math.abs(targetPointerY) <= 1) {
        const tanFov = Math.tan((55 * Math.PI) / 360);
        const rayX = targetPointerX * tanFov * aspect;
        const rayY = targetPointerY * tanFov;
        const dirX = m0 * rayX + m4 * rayY + m8 * -1;
        const dirY = m1 * rayX + m5 * rayY + m9 * -1;
        const dirZ = m2 * rayX + m6 * rayY + m10 * -1;
        const dLen = Math.hypot(dirX, dirY, dirZ) || 1;
        const ndX = dirX / dLen;
        const ndY = dirY / dLen;
        const ndZ = dirZ / dLen;

        let hitPlane = null;
        let minHitDist = Infinity;

        for (let i = 0; i < planes.length; i++) {
          const p = planes[i];
          if (p.opacity <= 0.01) continue;

          const denom = ndX * p.az[0] + ndY * p.az[1] + ndZ * p.az[2];
          if (Math.abs(denom) < 1e-6) continue;

          const px = p.x + camPosX;
          const py = p.y + camPosY;
          const pz = p.z;
          const dist = (px * p.az[0] + py * p.az[1] + pz * p.az[2]) / denom;
          if (dist <= 0 || dist >= minHitDist) continue;

          const hitX = ndX * dist - px;
          const hitY = ndY * dist - py;
          const hitZ = ndZ * dist - pz;

          const localX = hitX * p.ax[0] + hitY * p.ax[1] + hitZ * p.ax[2];
          const localY = hitX * p.ay[0] + hitY * p.ay[1] + hitZ * p.ay[2];

          if (Math.abs(localX) <= (options.objectWidth * p.scaleX) / 2 &&
              Math.abs(localY) <= (options.objectHeight * p.scaleY) / 2) {
            minHitDist = dist;
            hitPlane = p;
          }
        }

        if (hitPlane !== hoveredPlane) {
          if (hoveredPlane && hoveredPlane.videoSrc) pausePlaneVideo(hoveredPlane);
          hoveredPlane = hitPlane;
          if (hoveredPlane && hoveredPlane.videoSrc) playPlaneVideo(hoveredPlane);
          if (!isDragging) {
            container.style.cursor = hoveredPlane && hoveredPlane.link ? 'pointer' : 'grab';
          }
        }
      } else if (hoveredPlane) {
        if (hoveredPlane.videoSrc) pausePlaneVideo(hoveredPlane);
        hoveredPlane = null;
        if (!isDragging) container.style.cursor = 'grab';
      }

      // Update active video texture
      if (hoveredPlane && hoveredPlane.playing && hoveredPlane.videoSrc) {
        const vEntry = videoCache.get(hoveredPlane.videoSrc);
        if (vEntry && vEntry.el.readyState >= 2) {
          gl.bindTexture(gl.TEXTURE_2D, vEntry.tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vEntry.el);
          hoveredPlane.tex = vEntry.tex;
          hoveredPlane.hasMap = 1;
        }
      }

      // Sort planes back-to-front for transparency
      sortedPlanes.sort((a, b) => a.z - b.z);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Render planes
      for (let i = 0; i < sortedPlanes.length; i++) {
        const p = sortedPlanes[i];
        if (p.opacity <= 0.001) continue;

        gl.bindTexture(gl.TEXTURE_2D, p.tex || placeholderTex);
        gl.uniformMatrix4fv(uMVPLoc, false, p.mvp);
        gl.uniform2f(uRepeatLoc, p.repeatX, p.repeatY);
        gl.uniform2f(uOffsetLoc, p.offsetX, p.offsetY);
        gl.uniform1f(uOpacityLoc, p.opacity);
        gl.uniform1f(uHasMapLoc, p.hasMap ? 1.0 : 0.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    // Public API
    return {
      travel: (amount) => { targetTravel += amount; },
      setSpiral: (enabled) => { options.spiralMotion = !!enabled; },
      setAutoMotion: (enabled) => { options.autoMotion = !!enabled; },
      toggleFacing: () => {
        options.facing = options.facing === 'funnel' ? 'front' : 'funnel';
      },
      destroy: () => {
        isDestroyed = true;
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
        container.removeEventListener('wheel', onWheel);
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
        container.removeEventListener('pointerleave', onPointerLeave);
        container.removeEventListener('click', onClick);

        videoCache.forEach(v => {
          v.el.pause();
          v.el.removeAttribute('src');
          v.el.load();
          gl.deleteTexture(v.tex);
        });
        videoCache.clear();

        imageCache.forEach(v => gl.deleteTexture(v.tex));
        imageCache.clear();

        gl.deleteTexture(placeholderTex);
        gl.deleteBuffer(vertexBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        if (canvas.parentNode === container) {
          container.removeChild(canvas);
        }
      }
    };
  }

  global.initSpatialGallery = initSpatialGallery;
})(typeof window !== 'undefined' ? window : this);
