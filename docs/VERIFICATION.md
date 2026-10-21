# Verification — 20 October 2026

## Current implementation

Fine Craft is the generic creative site again: centered Fine Craft hero, fish-emblem navbar, Fine Craft footer, original branding copy, Features panel, two creative-resource folders, skills strip and original four-step Jan–Apr 2024 illustrative timeline. Personal content, CV UI/data/downloads, career history, personal project links and all bundled videos have been removed.

All seven palette options remain accessible from both the navbar and footer. Generic folder/file artwork continues to follow the active theme. The provided video was inspected internally as a six-frame motion contact sheet before removal; it is not shipped.

The approved steering, swim rig, surface deformation, fish renderer, depth composite and 0.995 follow-speed factor are unchanged. Body curves, delayed tail, separate fin motion and translucent lower-section fish are preserved. The only coordinator change is the generic layout-event name.

Depth geometry is cached and invalidated by resize/ScrollTrigger refresh. Lenis and GSAP retain one scroll clock, navbar navigation uses Lenis, and the medium-speed sequential timeline preserves clipping-safe measurement.

| Check | Result | Evidence / limit |
|---|---|---|
| Motion regression | PASS | Pointer/touch, renderer failover, 900 articulated poses, independent fins and delayed tail, reduced motion |
| Depth geometry and reversal | PASS | Four viewport geometries, hero return, footer emergence and monotonic reversible depth |
| Lower-section visibility regression | PASS | Full-depth nonzero opacity, controlled softness, 600 scroll frames without repeated layout reads, refresh invalidation and cleanup |
| Native Canvas rendering | PASS | Original fish PNG rendered at depths 0/.5/1; maximum alpha 255/186/116. Full-depth visible body area 47,466 pixels; moving the head 100px moves its visible centroid 100px |
| Production build | PASS | Vite production build; no GLSL/GPU runtime claim |
| Generic edition content | PASS | No personal-profile/video assets or UI; all bundled folder links resolve; seven palettes retained; five core motion modules byte-identical |
| Source whitespace | PASS | git diff --check |
| Browser appearance / WebGL runtime | NOT VERIFIED | Managed preview supervisor unavailable: sites-previewd mailbox missing. Browser local preview refused the connection |
| Desktop/tablet/mobile visual layout | NOT VERIFIED | Responsive CSS implemented; no working managed preview |
| Perceived scroll smoothness / FPS | NOT VERIFIED | Scroll work reduced and navigation unified; no browser performance measurement |

## Limits and preserved content

- The fish is a textured articulated 2.5D surface, not a volumetric model or physical underwater simulation.
- Softening is a screen-space approximation. WebGL shader runtime still requires a working browser/GPU check.
- The no-Canvas DOM fallback follows the cursor and remains translucent, but lacks articulated fins/body.
- The Jan–Apr 2024 timeline is the original supplied illustrative process component, not a claim about employment or client work.
- Generic file links point only to bundled artwork and text/JSON resources.
- No production visual acceptance or frame-rate claim is made.

## Reproduce

```bash
npm install
npm test
node scripts/verify-depth.mjs
npm run build
npm run dev
```

When preview is available, verify pointer-following fish through every section, text contrast with the fish behind panels, all seven palette changes, navbar anchors, journey pin/release and the final description, footer emergence, dialogs, reduced motion and desktop/mobile widths.

## Navbar emblem

The navbar uses the exact supplied curved fish image, stored unchanged as navbar-fish-source.png. An SVG luminance mask removes its white background at render time and fills its original silhouette with currentColor from the active palette. The accessible Fine Craft back-to-top button and 44px minimum hit area remain. Hero/footer lettering and swimming code are unchanged. The mask was rendered independently, checked for transparency and visually inspected; live browser appearance remains unverified.
