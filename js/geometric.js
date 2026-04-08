// geometric.js — Animated wireframe polyhedron for CRAVE
// Fixed position, evolves with scroll across all 3 sections

(function () {
  const canvas = document.getElementById('geometric-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DOT_SPACING = 4;
  const ROTATION_SPEED = 0.003;
  const MOUSE_INFLUENCE = 0.015;
  const MOUSE_EASE = 0.05;

  let width, height, dpr;
  let angleX = 0.4;
  let angleY = 0.2;
  let targetOffsetX = 0;
  let targetOffsetY = 0;
  let currentOffsetX = 0;
  let currentOffsetY = 0;
  let scrollProgress = 0; // 0 = top, 1 = bottom
  let clickPulse = 0; // 0 = no pulse, 1 = max pulse
  let clickDecay = 0.992;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragAngleX = 0;
  let dragAngleY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let hasDragged = false;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Icosahedron vertices
  const PHI = (1 + Math.sqrt(5)) / 2;
  const baseVertices = [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
  ];

  const edges = [
    [0,1],[0,5],[0,7],[0,10],[0,11],
    [1,5],[1,7],[1,8],[1,9],
    [2,3],[2,4],[2,6],[2,10],[2,11],
    [3,4],[3,6],[3,8],[3,9],
    [4,5],[4,9],[4,11],
    [5,9],[5,11],
    [6,7],[6,8],[6,10],
    [7,8],[7,10],
    [8,9],
    [10,11]
  ];

  function rotateX(point, angle) {
    const [x, y, z] = point;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x, y * cos - z * sin, y * sin + z * cos];
  }

  function rotateY(point, angle) {
    const [x, y, z] = point;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x * cos + z * sin, y, -x * sin + z * cos];
  }

  function rotateZ(point, angle) {
    const [x, y, z] = point;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x * cos - y * sin, x * sin + y * cos, z];
  }

  // Morph vertices based on scroll - distorts the shape progressively
  function morphVertices(vertices, progress, pulse) {
    const distortion = progress * 0.4;
    const pulseExpand = pulse * 0.6;
    return vertices.map((v, i) => {
      const noise = Math.sin(i * 2.7 + progress * 4) * distortion;
      const stretch = 1 + progress * 0.3;
      // Pulse: each vertex explodes outward then returns
      const pulseNoise = Math.sin(i * 4.1 + pulse * 10) * pulseExpand;
      const pulseFactor = 1 + pulseExpand * 0.4 + pulseNoise * 0.2;
      return [
        v[0] * (1 + noise * 0.3) * stretch * pulseFactor,
        v[1] * (1 + Math.cos(i * 1.3 + progress * 3) * distortion * 0.4) * pulseFactor,
        v[2] * (1 + Math.sin(i * 3.1 + progress * 5) * distortion * 0.3) * pulseFactor
      ];
    });
  }

  function project(point, scale, centerX, centerY) {
    const [x, y, z] = point;
    const perspective = 4;
    const factor = perspective / (perspective + z);
    return [
      centerX + x * scale * factor,
      centerY + y * scale * factor
    ];
  }

  // Faces for semi-transparent fill (triangulated icosahedron)
  const faces = [
    [0,1,5],[0,5,11],[0,11,10],[0,10,7],[0,7,1],
    [1,7,8],[1,8,9],[1,9,5],[5,9,4],[5,4,11],
    [11,4,2],[11,2,10],[10,2,6],[10,6,7],[7,6,8],
    [3,4,9],[3,9,8],[3,8,6],[3,6,2],[3,2,4]
  ];

  function drawDottedLine(x1, y1, x2, y2, opacity, color, dotSize) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(dist / DOT_SPACING);

    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const x = x1 + dx * t;
      const y = y1 + dy * t;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function drawSolidLine(x1, y1, x2, y2, opacity, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawVertex(x, y, opacity, color, size) {
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawFace(projected, rotated, indices, color, baseOpacity) {
    const avgZ = (rotated[indices[0]][2] + rotated[indices[1]][2] + rotated[indices[2]][2]) / 3;
    const depthFactor = (avgZ + 2.5) / 5;
    const opacity = baseOpacity * Math.max(0, Math.min(1, depthFactor));
    if (opacity < 0.005) return;

    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(projected[indices[0]][0], projected[indices[0]][1]);
    ctx.lineTo(projected[indices[1]][0], projected[indices[1]][1]);
    ctx.lineTo(projected[indices[2]][0], projected[indices[2]][1]);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Grain noise overlay
  let grainCanvas = null;
  function generateGrain() {
    grainCanvas = document.createElement('canvas');
    grainCanvas.width = 256;
    grainCanvas.height = 256;
    const gCtx = grainCanvas.getContext('2d');
    const imageData = gCtx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 18;
    }
    gCtx.putImageData(imageData, 0, 0);
  }
  generateGrain();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Scroll-driven parameters
    const scale = width * (0.12 + scrollProgress * 0.06); // grows with scroll
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Color transition: adapt to theme and scroll
    const isDark = document.body.classList.contains('dark');
    const baseR = isDark ? 107 : 58;
    const baseG = isDark ? 158 : 90;
    const baseB = isDark ? 116 : 64;
    const inContact = Math.max(0, (scrollProgress - 0.6) / 0.4);
    const targetR = isDark ? 200 : 250;
    const targetG = isDark ? 210 : 248;
    const targetB = isDark ? 200 : 243;
    const r = Math.round(baseR + inContact * (targetR - baseR));
    const g = Math.round(baseG + inContact * (targetG - baseG));
    const b = Math.round(baseB + inContact * (targetB - baseB));
    const color = `rgb(${r}, ${g}, ${b})`;

    // Overall opacity: slightly fades in contact zone
    const globalOpacity = 1 - inContact * 0.5;

    // Dot size grows slightly
    const dotSize = 1 + scrollProgress * 0.5;

    // Decay click pulse
    if (clickPulse > 0.001) {
      clickPulse *= clickDecay;
    } else {
      clickPulse = 0;
    }

    // Morph vertices
    const morphed = morphVertices(baseVertices, scrollProgress, clickPulse);

    // Apply rotations - more tilt with scroll
    const scrollTilt = scrollProgress * 0.8;
    const rotated = morphed.map(v => {
      let p = rotateX(v, angleX + scrollTilt);
      p = rotateY(p, angleY);
      p = rotateZ(p, scrollProgress * 0.4);
      return p;
    });

    const projected = rotated.map(v => project(v, scale, centerX, centerY));

    // Sort edges by z-depth
    const edgesWithDepth = edges.map(([a, b]) => {
      const avgZ = (rotated[a][2] + rotated[b][2]) / 2;
      return { a, b, avgZ };
    });
    edgesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

    // Draw semi-transparent faces (back faces first)
    const facesWithDepth = faces.map((f) => {
      const avgZ = (rotated[f[0]][2] + rotated[f[1]][2] + rotated[f[2]][2]) / 3;
      return { indices: f, avgZ };
    });
    facesWithDepth.sort((a, b) => a.avgZ - b.avgZ);
    facesWithDepth.forEach(({ indices }) => {
      drawFace(projected, rotated, indices, color, 0.08);
    });

    // Draw edges - mix of dotted and solid based on depth
    edgesWithDepth.forEach(({ a, b, avgZ }) => {
      const [x1, y1] = projected[a];
      const [x2, y2] = projected[b];
      const depthOpacity = 0.4 + 0.6 * ((avgZ + 2) / 4);
      const opacity = Math.max(0.1, Math.min(1, depthOpacity)) * globalOpacity;

      // Front edges: solid thin line, back edges: dotted
      if (avgZ > 0) {
        drawSolidLine(x1, y1, x2, y2, opacity * 0.5, color, 0.5);
        drawDottedLine(x1, y1, x2, y2, opacity, color, dotSize);
      } else {
        drawDottedLine(x1, y1, x2, y2, opacity * 0.7, color, dotSize * 0.8);
      }
    });

    // Draw vertices (nodes at intersections)
    projected.forEach(([x, y], i) => {
      const z = rotated[i][2];
      const depthOpacity = 0.3 + 0.7 * ((z + 2) / 4);
      const opacity = Math.max(0.15, Math.min(1, depthOpacity)) * globalOpacity;
      const vertexSize = (2 + scrollProgress * 1.5) * (0.7 + depthOpacity * 0.3);
      drawVertex(x, y, opacity, color, vertexSize);
    });

    // Grain overlay
    if (grainCanvas) {
      ctx.globalAlpha = 0.08;
      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    }

    // Ease towards mouse target
    currentOffsetX += (targetOffsetX - currentOffsetX) * MOUSE_EASE;
    currentOffsetY += (targetOffsetY - currentOffsetY) * MOUSE_EASE;

    // Rotation speed increases slightly with scroll, pauses during drag
    if (!isDragging) {
      const speedMultiplier = 1 + scrollProgress * 0.5;
      angleX += ROTATION_SPEED * 0.7 * speedMultiplier + currentOffsetY;
      angleY += ROTATION_SPEED * speedMultiplier + currentOffsetX;
    }

    requestAnimationFrame(draw);
  }

  // Scroll tracking
  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  });

  // Mouse interaction
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetOffsetX = ((e.clientX - centerX) / centerX) * MOUSE_INFLUENCE;
      targetOffsetY = ((e.clientY - centerY) / centerY) * MOUSE_INFLUENCE;
    }
    // Cursor change in shape zone
    if (e.clientX > window.innerWidth * 0.35) {
      document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
    } else {
      document.body.style.cursor = '';
    }
  });

  document.addEventListener('mouseleave', () => {
    targetOffsetX = 0;
    targetOffsetY = 0;
  });

  // Drag interaction - grab and rotate
  document.addEventListener('mousedown', (e) => {
    if (e.clientX > window.innerWidth * 0.35) {
      e.preventDefault();
      isDragging = true;
      hasDragged = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragAngleX = angleX;
      dragAngleY = angleY;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
      dragOffsetX = dx * 0.008;
      dragOffsetY = dy * 0.008;
      angleY = dragAngleY + dragOffsetX;
      angleX = dragAngleX + dragOffsetY;
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (isDragging) {
      isDragging = false;
      // Only pulse if it was a click (not a drag)
      if (!hasDragged && e.clientX > window.innerWidth * 0.35) {
        clickPulse = 1;
      }
    }
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// Scroll-triggered fade-in animations
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
  });

  // Make hero elements visible immediately (above the fold)
  document.querySelectorAll('.hero .fade-in').forEach((el) => {
    setTimeout(() => el.classList.add('visible'), 300);
  });

  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const saved = localStorage.getItem('theme');
    if (saved) {
      // User has a saved preference, use it
      if (saved === 'dark') document.body.classList.add('dark');
    } else {
      // No preference: auto based on time (dark between 20h and 7h)
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 7) document.body.classList.add('dark');
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // Legal toggle
  const legalToggle = document.getElementById('legal-toggle');
  const legalContent = document.getElementById('legal-content');
  if (legalToggle && legalContent) {
    legalToggle.addEventListener('click', () => {
      legalContent.classList.toggle('open');
    });
  }

  // Nav color switch on contact section
  const nav = document.querySelector('.nav');
  const contactSection = document.getElementById('contact');
  if (nav && contactSection) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          nav.classList.toggle('nav--light', entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    navObserver.observe(contactSection);
  }
})();
