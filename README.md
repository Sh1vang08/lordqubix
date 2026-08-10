# Qubix & LORD — Professional Audio Website

React + Vite implementation of the six approved page designs for Qubix /
LORD professional audio.

## Pages

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/products` | All Products (search, category filters, brand tabs, pagination) |
| `/products/power-amplifiers` | Power Amplifiers category |
| `/products/qx-series` | QX Series product detail (gallery + spec table) |
| `/about` | About Us |
| `/contact` | Contact / WhatsApp enquiry |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  assets/
    catalogue/     all 204 supplied catalogue extractions
    products/      named product shots used across the pages
    backgrounds/   the four high-resolution decorative backgrounds
  components/      Header, Footer, Icon, Logo, WhatsAppCta
  data/
    site.js        page copy, product data and specifications
    catalogue.js   indexes every catalogue asset by page/family
  pages/           one .jsx + .css pair per page
  styles/          design tokens + global primitives
```

## Design notes

- **Palette**: built from the brand logo — antique gold (`#c8922a`) on a
  warm near-black shell. `theme.css` is the single source: the older
  blue/red token names are aliased to gold there, so the whole site
  re-themes from one file.
- **Logo**: the supplied lockup (`src/assets/logo.png`) is used as-is in
  the header and footer.
- **Type**: Anton for headlines and big numerals (the heavy compressed
  poster face used across festival and pro-audio branding), Barlow
  Condensed for nav / buttons / eyebrows, Roboto Condensed for body copy.
- **Header/footer**: one shared lockup on every page, linking only the six
  real routes.
- **Imagery**: product shots are transparent cut-outs with very different
  aspect ratios, so every fixed-height media box letterboxes them via
  `object-fit: contain`.
- **Responsive**: single-column below 900px with a slide-in drawer nav; the
  specification table scrolls inside its own container so the page body
  never scrolls sideways.
- **WhatsApp** is the primary enquiry channel; the contact form composes a
  pre-filled message (there is no backend in this build).

## Animation

GSAP + ScrollTrigger, wired through `src/anim/`:

- `gsap.js` — plugin registration, shared easing/durations, trigger defaults.
- `useAnim.js` — the `useGsap` hook plus recipes: `revealOnScroll`,
  `parallax`, `countUp`, `splitWords` (masked word reveals), `scrubWords`
  (scroll-linked copy), `scrimReveal`, `trackIn`, `magnetic`, `hoverLift`,
  `drift`, `drawLine` and `equaliser`.

Each page scopes its animations to a container ref via `gsap.context()`, so
a single `revert()` cleans up every tween and ScrollTrigger on unmount —
necessary because React StrictMode double-mounts effects and client-side
routing swaps whole pages.

Notes on the implementation:

- Reveals use `fromTo` rather than `from`. With `from`, a ScrollTrigger that
  never fires leaves the element parked at opacity 0 and the content
  silently disappears; `fromTo` always has a reachable resting state.
- Triggers are `once: true` so a later refresh cannot rewind a completed
  reveal. A refresh listener additionally rescues any element left hidden
  above the fold — content must never stay invisible.
- `ScrollTrigger.refresh()` runs after late images decode, since product
  imagery settles after the initial trigger positions are computed.
- `prefers-reduced-motion: reduce` skips all of it and renders the finished
  layout immediately.

Product model names and specifications follow the supplied catalogue —
verify final copy before publishing.

## Sections & widgets

- **Behind the Craft** (`components/BehindTheCraft.jsx`) — auto-advancing
  video reel. Only the active clip plays; the rest stay paused on a poster
  so a single decode is in flight. Clips live in `public/reel/` (~60 MB)
  and stream rather than entering the bundle graph.
- **Music bar** (`components/MusicBar.jsx`) — sticky ambient-audio toggle,
  mounted outside `<Routes>` so playback survives navigation. Starts paused
  because browsers block autoplay with sound until a user gesture.
- **Scroll rail** (`components/ScrollRail.jsx`) — page-progress bar, keyed
  on the route so it re-measures per page.

## Product data

Model names, categories and counts follow the live Qubix/LORD catalogue
(169 products across 10 site categories). `data/site.js` holds the copy and
product list; `data/catalogue.js` indexes all 204 supplied images.
