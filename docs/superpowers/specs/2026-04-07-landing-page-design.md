# CRAVE - Landing Page Design Spec

## Objectif

Landing page vitrine + conversion pour CRAVE. Presenter l'offre, donner confiance, guider vers la prise de contact (tel + email).

## Cible

Cabinets d'avocats et professions juridiques (< 30 personnes). Dirigeants, associes, office managers. Pas des profils tech.

## Positionnement

"Anti-legaltech" : entre les ERP rigides (Secib, zLawyer) et les plateformes IA enterprise (Luminance, Doctrine). CRAVE comble le vide avec des outils pilotables, legers, sur mesure.

Baseline : "Simplifier votre quotidien professionnel"

## Stack technique

- HTML/CSS/JS pur (aucun framework)
- Typo : Satoshi Bold (titres) / Satoshi Regular (corps) via @font-face
- Hebergement : GitHub Pages, Netlify ou equivalent (statique, gratuit)
- Pas de build pipeline, pas de dependances npm

## Charte graphique

| Element | Valeur |
|---------|--------|
| Fond | Blanc casse / creme |
| Texte | Noir |
| Accent | #3A5A40 (vert sapin) |
| Typo titres | Satoshi Bold |
| Typo corps | Satoshi Regular |
| Style | Epure, aere, grandes marges, pas de stock photos |
| Interdit | Fonds noirs, cliparts, illustrations generiques |

## Inspirations visuelles

- **Perspective.fi** : une page, typo forte, visuel geometrique, contact minimaliste
- **Fontshare** : fond clair, typo hero, espacement genereux
- **BB-Bureau** : minimalisme radical, la typo est le design
- **Good Type Foundry** : grille propre, fond blanc, zero bruit
- **Legora** : structure SaaS legal propre (reference pour le contenu, pas le style)

Patterns communs retenus : minimalisme, typo comme element hero, espacement genereux, navigation discrete, pas de photos.

## Structure - 3 sections full-screen

### Section 1 : Hero

**Objectif :** Impact immediat. Comprendre qui est CRAVE en 3 secondes.

**Layout :** Split horizontal - texte a gauche, visuel a droite (style Perspective.fi)

**Contenu gauche :**
- "CRAVE" en tres grand (typo Satoshi Bold, display size)
- Accroche positionnement : "J'interviens la ou vos outils s'arretent." ou formulation equivalente du pitch ("Mon approche : je pars de votre quotidien, pas d'une solution toute faite.")
- Eventuellement la baseline "Simplifier votre quotidien professionnel" en plus petit

**Contenu droite :**
- Visuel geometrique abstrait (forme 3D, generatif, pointilles, lignes)
- Anime subtilement en CSS/JS (rotation lente, particules, morphing)
- Pas figuratif, pas illustratif. Purement graphique.

**Navigation :**
- Quasi inexistante. "CRAVE" en haut a gauche, un lien "Contact" discret en haut a droite. Pas de burger menu, pas de mega-nav.

### Section 2 : Missions

**Objectif :** Comprendre ce que CRAVE fait concretement, en un coup d'oeil.

**Layout :** Centre, une ligne d'accroche + 4 mots-cles en dessous

**Contenu :**
- Phrase d'accroche (ex: "Entre les deux, un besoin subsiste." ou "Des outils pilotables, legers, avec une prise en main facile.")
- 4 mots-cles affiches en bold, espaces :
  - Conseil & Strategie
  - Structuration
  - Automatisation
  - Outils sur mesure
- Pas de paragraphes explicatifs. Les mots-cles parlent d'eux-memes. Eventuellement une ligne de sous-texte par mot-cle (optionnel).

**Style :**
- Aere, les mots-cles respirent
- Accent vert sapin sur les mots-cles ou en separateur (ligne fine, comme dans le pitch deck)

### Section 3 : Contact

**Objectif :** Convertir. Donner envie de prendre contact.

**Layout :** Centre, minimaliste

**Contenu :**
- Accroche : "Parlons de votre quotidien" (ou equivalent conversationnel, pair-a-pair)
- Numero de telephone affiche
- Adresse email affichee (lien mailto:)
- "CRAVE" en bas de page en petit, vert sapin

**Style :**
- Fond potentiellement en vert sapin #3A5A40 avec texte creme (inversion) pour marquer la rupture visuelle avec les sections precedentes
- Ou fond creme continu, minimaliste

## Responsive

- Mobile-first dans l'approche CSS
- Hero : le split passe en vertical (texte au-dessus, visuel en dessous)
- Missions : les 4 mots-cles passent en colonne
- Contact : inchange (deja centre)

## Hors scope (evolutions futures)

- Integration Calendly (prise de RDV)
- Section realisations / cas clients
- Blog ou articles
- Mentions legales / CGV
- Formulaire de contact
- Multi-pages

## Criteres de succes

- La page charge en < 1 seconde
- Un visiteur comprend ce que fait CRAVE en 3 secondes
- Le contact (tel/email) est accessible sans scroller sur desktop
- Le site est visuellement au niveau des references (Perspective.fi, Fontshare)
- Le design est fidele a la charte CRAVE (vert sapin, creme, Satoshi, epure)
