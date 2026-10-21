# Fine Craft

A creative React website with a cursor-following koi, a full-page water/star atmosphere, seven colour palettes, glass navigation and footer, Features panel, interactive files and a pinned four-step timeline.

## Run in VS Code

Extract the ZIP, open the Fine_Craft_React folder containing package.json in VS Code, then open Terminal → New Terminal:

```bash
npm install
npm run dev
```

Open the Local URL printed by Vite. Press Ctrl+C to stop. Node.js LTS and npm are required.

```bash
npm test
node scripts/verify-depth.mjs
npm run build
npm run preview
```

## Edit the content

- src/data/site.js: Fine Craft branding and tagline.
- src/data/features.jsx: the five Features panels.
- src/data/skills.js: the seamless skills strip.
- src/components/Projects.jsx: the two generic experiment/resource folders.
- src/components/TimelineBasic.jsx: the original Jan–Apr 2024 example timeline, with sequential scroll ticks.
- src/themes.js and src/styles.css: all seven colour palettes.
- public/files/: interaction notes and palette resources linked from the glass folders.

This is the generic Fine Craft edition. It contains no personal profile, CV, career history, personal project collection, reference-video button or bundled video. The timeline is the original illustrative process component, not an employment history.

## Motion and themes

The approved fish steering, body rig, tail delay, independent fins and 0.5% slower follow speed are preserved. This remains the original articulated 2.5D texture, not a volumetric model. The actual fish stays visible at 46% opacity beneath content and returns to the foreground over hero/footer lettering. The last-resort DOM fallback follows the cursor but cannot articulate the body.

Colors in the navbar and Choose your palette in the footer both open the seven-option palette selector: red/cream, blue/pearl, black/white, golden/white, orange/white, blue/silver/white, pearl white/soft gold. The fish, atmosphere, glass panels and file artwork respond together. Theme changes recolour the existing artwork without regenerating procedural canvases.

Lenis and GSAP share one scroll clock. Navbar jumps use the same Lenis instance. Journey pin distance remains at a medium 1.45 viewport heights, with a 720px minimum, reversible ticks and a clipping-safe final-step window.

## Verification

See docs/VERIFICATION.md. Motion/depth checks and the production build are run before delivery. Managed browser preview is currently unavailable, so live WebGL performance, visual timing and responsive screenshots are not claimed as verified.
