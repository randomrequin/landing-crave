# CRAVE Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, static landing page for CRAVE with 3 full-screen sections: hero with geometric visual, missions (4 keywords), and contact (tel + email).

**Architecture:** Single HTML file with linked CSS and JS. No framework, no build step. Satoshi font loaded via @font-face. Geometric 3D visual rendered with HTML5 Canvas + vanilla JS. Sections are full-viewport-height divs with scroll-snap.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid, scroll-snap), vanilla JS (Canvas API for geometric visual, IntersectionObserver for scroll animations).

**Spec:** `docs/superpowers/specs/2026-04-07-landing-page-design.md`

**Inspirations:** Perspective.fi (layout, visual), Fontshare (typo hero), BB-Bureau (minimalisme)

---

## File Structure

```
site/
  index.html          — Page HTML complete (structure, meta, liens)
  css/
    reset.css         — CSS reset minimal (box-sizing, margins)
    style.css         — Styles principaux (variables, layout, sections, responsive)
  js/
    geometric.js      — Rendu canvas du visuel geometrique anime
  fonts/
    Satoshi-Bold.woff2
    Satoshi-Regular.woff2
```

---

### Task 1: Project scaffolding and font setup

**Files:**
- Create: `site/index.html`
- Create: `site/css/reset.css`
- Create: `site/css/style.css`
- Create: `site/js/geometric.js`
- Download: `site/fonts/Satoshi-Bold.woff2`, `site/fonts/Satoshi-Regular.woff2`

- [ ] **Step 1: Download Satoshi font files**

Go to https://www.fontshare.com/fonts/satoshi and download the font family. Extract `Satoshi-Bold.woff2` and `Satoshi-Regular.woff2` into `site/fonts/`.

If direct download is not scriptable, use:

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
mkdir -p fonts
# Download from fontshare API
curl -L "https://api.fontshare.com/v2/fonts/download/satoshi" -o fonts/satoshi.zip
cd fonts && unzip -o satoshi.zip && cd ..
# Keep only the woff2 files we need
find fonts -name "Satoshi-Bold.woff2" -exec cp {} fonts/Satoshi-Bold.woff2 \;
find fonts -name "Satoshi-Regular.woff2" -exec cp {} fonts/Satoshi-Regular.woff2 \;
```

- [ ] **Step 2: Create CSS reset**

```css
/* reset.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 3: Create base style.css with custom properties and @font-face**

```css
/* style.css */

@font-face {
  font-family: 'Satoshi';
  src: url('../fonts/Satoshi-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Satoshi';
  src: url('../fonts/Satoshi-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --color-bg: #FAF8F3;
  --color-text: #1A1A1A;
  --color-accent: #3A5A40;
  --color-accent-light: rgba(58, 90, 64, 0.1);
  --font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
  --section-padding: 6rem 4rem;
}

body {
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.5;
}

section {
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
}
```

- [ ] **Step 4: Create index.html skeleton**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CRAVE - Simplifier votre quotidien professionnel. Conseil, structuration, automatisation et outils sur mesure pour cabinets d'avocats et professions juridiques.">
  <title>CRAVE - Simplifier votre quotidien professionnel</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <nav class="nav">
    <span class="nav__logo">CRAVE</span>
    <a href="#contact" class="nav__link">Contact</a>
  </nav>

  <section id="hero" class="hero">
    <!-- Task 2 -->
  </section>

  <section id="missions" class="missions">
    <!-- Task 3 -->
  </section>

  <section id="contact" class="contact">
    <!-- Task 4 -->
  </section>

  <script src="js/geometric.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create empty geometric.js placeholder**

```js
// geometric.js — animated geometric visual for hero section
// Implementation in Task 5
```

- [ ] **Step 6: Verify in browser and commit**

```bash
open "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site/index.html"
```

Expected: page blanche creme, "CRAVE" et "Contact" dans la nav en Satoshi. 3 sections vides scrollables.

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git init
git add -A
git commit -m "feat: scaffold landing page with fonts, reset, base styles"
```

---

### Task 2: Hero section (text side)

**Files:**
- Modify: `site/index.html` (hero section)
- Modify: `site/css/style.css` (nav + hero styles)

- [ ] **Step 1: Add nav styles to style.css**

```css
/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
}

.nav__logo {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: var(--color-accent);
}

.nav__link {
  font-weight: 400;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  color: var(--color-text);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.nav__link:hover {
  opacity: 1;
}
```

- [ ] **Step 2: Add hero HTML content**

Replace the hero section in `index.html`:

```html
<section id="hero" class="hero">
  <div class="hero__content">
    <h1 class="hero__title">CRAVE</h1>
    <p class="hero__tagline">J'interviens la ou vos outils s'arretent.</p>
    <p class="hero__baseline">Structurer vos donnees, automatiser vos taches repetitives, creer ce qui n'existe pas sur le marche.</p>
  </div>
  <div class="hero__visual">
    <canvas id="geometric-canvas"></canvas>
  </div>
</section>
```

- [ ] **Step 3: Add hero styles to style.css**

```css
/* Hero */
.hero {
  padding: var(--section-padding);
  padding-top: 8rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero__content {
  max-width: 600px;
}

.hero__title {
  font-weight: 700;
  font-size: clamp(4rem, 10vw, 8rem);
  letter-spacing: 0.05em;
  line-height: 0.95;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.hero__tagline {
  font-weight: 700;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  color: var(--color-accent);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.hero__baseline {
  font-weight: 400;
  font-size: clamp(0.95rem, 1.5vw, 1.125rem);
  color: var(--color-text);
  opacity: 0.7;
  line-height: 1.6;
  max-width: 480px;
}

.hero__visual {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.hero__visual canvas {
  width: 100%;
  max-width: 500px;
  height: auto;
  aspect-ratio: 1;
}
```

- [ ] **Step 4: Verify in browser and commit**

```bash
open "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site/index.html"
```

Expected: hero avec "CRAVE" en tres grand a gauche, tagline en vert sapin, baseline en gris. Canvas vide a droite (sera rempli au Task 5).

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git add index.html css/style.css
git commit -m "feat: add hero section layout and typography"
```

---

### Task 3: Missions section

**Files:**
- Modify: `site/index.html` (missions section)
- Modify: `site/css/style.css` (missions styles)

- [ ] **Step 1: Add missions HTML content**

Replace the missions section in `index.html`:

```html
<section id="missions" class="missions">
  <div class="missions__inner">
    <p class="missions__accroche">Entre les ERP rigides et les plateformes IA surdimensionnees,<br><strong>un besoin subsiste.</strong></p>
    <div class="missions__grid">
      <div class="missions__item">
        <span class="missions__separator"></span>
        <h3 class="missions__keyword">Conseil & Strategie</h3>
      </div>
      <div class="missions__item">
        <span class="missions__separator"></span>
        <h3 class="missions__keyword">Structuration</h3>
      </div>
      <div class="missions__item">
        <span class="missions__separator"></span>
        <h3 class="missions__keyword">Automatisation</h3>
      </div>
      <div class="missions__item">
        <span class="missions__separator"></span>
        <h3 class="missions__keyword">Outils sur mesure</h3>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add missions styles to style.css**

```css
/* Missions */
.missions {
  padding: var(--section-padding);
  justify-content: center;
}

.missions__inner {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.missions__accroche {
  font-weight: 400;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  line-height: 1.5;
  color: var(--color-text);
  margin-bottom: 4rem;
}

.missions__accroche strong {
  font-weight: 700;
  color: var(--color-accent);
}

.missions__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.missions__item {
  text-align: center;
}

.missions__separator {
  display: block;
  width: 40px;
  height: 3px;
  background-color: var(--color-accent);
  margin: 0 auto 1.25rem;
}

.missions__keyword {
  font-weight: 700;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: var(--color-text);
  letter-spacing: 0.02em;
}
```

- [ ] **Step 3: Verify in browser and commit**

```bash
open "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site/index.html"
```

Expected: section centree avec accroche, "un besoin subsiste." en vert bold, et 4 mots-cles en grille avec separateurs verts au-dessus.

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git add index.html css/style.css
git commit -m "feat: add missions section with 4 keywords"
```

---

### Task 4: Contact section

**Files:**
- Modify: `site/index.html` (contact section)
- Modify: `site/css/style.css` (contact styles)

- [ ] **Step 1: Add contact HTML content**

Replace the contact section in `index.html`:

```html
<section id="contact" class="contact">
  <div class="contact__inner">
    <h2 class="contact__accroche">Parlons de votre quotidien.</h2>
    <div class="contact__details">
      <a href="tel:+33XXXXXXXXX" class="contact__item">
        <span class="contact__label">Telephone</span>
        <span class="contact__value">+33 X XX XX XX XX</span>
      </a>
      <a href="mailto:contact@crave.fr" class="contact__item">
        <span class="contact__label">Email</span>
        <span class="contact__value">contact@crave.fr</span>
      </a>
    </div>
    <span class="contact__brand">CRAVE</span>
  </div>
</section>
```

**Note:** Remplacer `+33XXXXXXXXX` et `contact@crave.fr` par les vraies coordonnees.

- [ ] **Step 2: Add contact styles to style.css**

```css
/* Contact */
.contact {
  padding: var(--section-padding);
  background-color: var(--color-accent);
  justify-content: center;
}

.contact__inner {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.contact__accroche {
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: var(--color-bg);
  margin-bottom: 3rem;
  line-height: 1.1;
}

.contact__details {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 4rem;
}

.contact__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.contact__item:hover {
  opacity: 0.8;
}

.contact__label {
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-bg);
  opacity: 0.6;
}

.contact__value {
  font-weight: 700;
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-bg);
}

.contact__brand {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  color: var(--color-bg);
  opacity: 0.4;
  margin-top: 2rem;
}
```

- [ ] **Step 3: Verify in browser and commit**

```bash
open "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site/index.html"
```

Expected: section fond vert sapin, "Parlons de votre quotidien." en creme, tel + email centres, "CRAVE" discret en bas. Belle inversion de couleur par rapport aux sections precedentes.

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git add index.html css/style.css
git commit -m "feat: add contact section with inverted green background"
```

---

### Task 5: Geometric visual (canvas animation)

**Files:**
- Modify: `site/js/geometric.js`

- [ ] **Step 1: Implement the animated geometric visual**

Write the full `geometric.js`. This creates a rotating wireframe polyhedron with stippled/dotted edges, inspired by the Perspective.fi cube aesthetic but adapted to CRAVE's identity (using vert sapin color).

```js
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
```

- [ ] **Step 2: Verify in browser and commit**

```bash
open "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site/index.html"
```

Expected: icosaedre en pointilles vert sapin qui tourne lentement dans la partie droite du hero. Effet de profondeur avec opacite variable. Style coherent avec le cube de Perspective.fi mais en vert sapin sur fond creme.

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git add js/geometric.js
git commit -m "feat: add animated geometric icosahedron in hero"
```

---

### Task 6: Responsive design

**Files:**
- Modify: `site/css/style.css` (media queries)

- [ ] **Step 1: Add responsive styles at the bottom of style.css**

```css
/* Responsive */
@media (max-width: 768px) {
  :root {
    --section-padding: 4rem 2rem;
  }

  .nav {
    padding: 1rem 2rem;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-top: 6rem;
  }

  .hero__content {
    text-align: center;
    max-width: 100%;
  }

  .hero__baseline {
    max-width: 100%;
  }

  .hero__visual {
    max-height: 300px;
  }

  .hero__visual canvas {
    max-width: 300px;
  }

  .missions__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem 1.5rem;
  }

  .contact__details {
    flex-direction: column;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  :root {
    --section-padding: 3rem 1.5rem;
  }

  .missions__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .missions__accroche br {
    display: none;
  }
}
```

- [ ] **Step 2: Test on mobile viewport and commit**

Ouvrir les DevTools (Cmd+Option+I), passer en mode responsive, tester sur :
- iPhone SE (375px)
- iPhone 14 (390px)
- iPad (768px)
- Desktop (1440px)

Expected: hero empile verticalement sur mobile, mots-cles en 2 colonnes sur tablette, 1 colonne sur petit mobile. Contact empile proprement.

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git add css/style.css
git commit -m "feat: add responsive design for mobile and tablet"
```

---

### Task 7: Scroll animations and polish

**Files:**
- Modify: `site/css/style.css` (animation classes)
- Modify: `site/js/geometric.js` (add scroll observer)

- [ ] **Step 1: Add fade-in animation CSS to style.css**

```css
/* Scroll animations */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.fade-in:nth-child(2) { transition-delay: 0.1s; }
.fade-in:nth-child(3) { transition-delay: 0.2s; }
.fade-in:nth-child(4) { transition-delay: 0.3s; }
```

- [ ] **Step 2: Add fade-in classes to HTML elements**

Add `class="fade-in"` to these elements in `index.html`:
- `.hero__tagline`
- `.hero__baseline`
- `.missions__accroche`
- Each `.missions__item` (4 elements)
- `.contact__accroche`
- `.contact__details`

Example for hero:
```html
<p class="hero__tagline fade-in">J'interviens la ou vos outils s'arretent.</p>
<p class="hero__baseline fade-in">Structurer vos donnees, automatiser vos taches repetitives, creer ce qui n'existe pas sur le marche.</p>
```

Example for missions:
```html
<p class="missions__accroche fade-in">Entre les ERP rigides...</p>
<div class="missions__grid">
  <div class="missions__item fade-in">...</div>
  <div class="missions__item fade-in">...</div>
  <div class="missions__item fade-in">...</div>
  <div class="missions__item fade-in">...</div>
</div>
```

Example for contact:
```html
<h2 class="contact__accroche fade-in">Parlons de votre quotidien.</h2>
<div class="contact__details fade-in">...</div>
```

- [ ] **Step 3: Add IntersectionObserver to geometric.js**

Append this at the end of `geometric.js`, outside the IIFE:

```js
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
```

- [ ] **Step 4: Verify animations and commit**

```bash
open "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site/index.html"
```

Expected: elements du hero apparaissent avec un leger fade-in au chargement. En scrollant vers Missions puis Contact, les elements apparaissent progressivement avec un decalage entre chaque mot-cle.

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git add index.html css/style.css js/geometric.js
git commit -m "feat: add scroll-triggered fade-in animations"
```

---

### Task 8: Final polish and meta

**Files:**
- Modify: `site/index.html` (meta tags, favicon, final tweaks)
- Modify: `site/css/style.css` (selection color, smooth scroll, small tweaks)

- [ ] **Step 1: Add meta tags and favicon to index.html head**

Add after existing meta tags:

```html
<meta name="theme-color" content="#3A5A40">
<meta property="og:title" content="CRAVE - Simplifier votre quotidien professionnel">
<meta property="og:description" content="Conseil, structuration, automatisation et outils sur mesure pour cabinets d'avocats et professions juridiques.">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◆</text></svg>">
```

- [ ] **Step 2: Add final CSS polish to style.css**

```css
/* Selection */
::selection {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* Smooth anchor scroll offset for fixed nav */
#hero { scroll-margin-top: 0; }
#missions { scroll-margin-top: 0; }
#contact { scroll-margin-top: 0; }
```

- [ ] **Step 3: Final full-page review in browser**

```bash
open "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site/index.html"
```

Checklist visuelle :
- [ ] Nav fixe visible sur toutes les sections
- [ ] Hero : CRAVE enorme, tagline vert, baseline grise, icosaedre anime a droite
- [ ] Missions : accroche centree, 4 mots-cles avec separateurs verts
- [ ] Contact : fond vert sapin, accroche creme, tel + email
- [ ] Scroll smooth entre sections
- [ ] Animations fade-in au scroll
- [ ] Responsive OK sur mobile (DevTools)
- [ ] Typo Satoshi chargee correctement

- [ ] **Step 4: Commit**

```bash
cd "/Users/macbookpro/Desktop/CRAVE/Organisation interne/site"
git add -A
git commit -m "feat: add meta tags, favicon, and final polish"
```
