// geometric.js — Animated wireframe polyhedron for CRAVE hero

(function () {
  const canvas = document.getElementById('geometric-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const ACCENT = '#3A5A40';
  const DOT_SPACING = 4;
  const ROTATION_SPEED = 0.003;
  let width, height, dpr;
  let angleX = 0.4;
  let angleY = 0.2;
  let animationId;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.width; // square
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Icosahedron vertices
  const PHI = (1 + Math.sqrt(5)) / 2;
  const rawVertices = [
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

  function project(point) {
    const scale = width * 0.22;
    const [x, y, z] = point;
    const perspective = 4;
    const factor = perspective / (perspective + z);
    return [
      width / 2 + x * scale * factor,
      height / 2 + y * scale * factor
    ];
  }

  function drawDottedLine(x1, y1, x2, y2, opacity) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(dist / DOT_SPACING);

    ctx.fillStyle = ACCENT;
    ctx.globalAlpha = opacity;

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const x = x1 + dx * t;
      const y = y1 + dy * t;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const rotated = rawVertices.map(v => {
      let p = rotateX(v, angleX);
      p = rotateY(p, angleY);
      return p;
    });

    const projected = rotated.map(v => project(v));

    // Sort edges by average z-depth for basic depth ordering
    const edgesWithDepth = edges.map(([a, b]) => {
      const avgZ = (rotated[a][2] + rotated[b][2]) / 2;
      return { a, b, avgZ };
    });
    edgesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

    edgesWithDepth.forEach(({ a, b, avgZ }) => {
      const [x1, y1] = projected[a];
      const [x2, y2] = projected[b];
      const opacity = 0.25 + 0.75 * ((avgZ + 2) / 4);
      drawDottedLine(x1, y1, x2, y2, Math.max(0.15, Math.min(1, opacity)));
    });

    angleX += ROTATION_SPEED * 0.7;
    angleY += ROTATION_SPEED;

    animationId = requestAnimationFrame(draw);
  }

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
})();
