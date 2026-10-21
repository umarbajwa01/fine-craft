import assert from 'node:assert/strict';
import { resolveDepth, footerDepth, createDepthCoordinator } from '../src/scene/depthCoordinator.js';
for (const [hero,viewport] of [[1440,900],[1300,800],[1100,700],[700,700]]) {
  const range=Math.max(viewport*.5,hero-viewport);
  assert.equal(resolveDepth(0,hero,viewport,1).state,'HERO_ACTIVE');
  assert.equal(resolveDepth(range,hero,viewport,1).state,'CONTENT_UNDERLAY');
  assert.equal(resolveDepth(range*.3,hero,viewport,-1).state,'NAVBAR_APPROACH');
  assert.equal(resolveDepth(range*.08,hero,viewport,-1).state,'NAVBAR_FOREGROUND');
  let prior=0;
  for(let i=0;i<=100;i++) {
    const down=resolveDepth(range*i/100,hero,viewport,1);
    const up=resolveDepth(range*i/100,hero,viewport,-1);
    assert(down.depth>=prior && down.depth<=1); assert.equal(down.depth,up.depth); prior=down.depth;
  }
  assert.equal(resolveDepth(range*3,hero,viewport,-1).state,'CONTENT_UNDERLAY');
}
assert.equal(resolveDepth(0,1440,900,-1,'NAVBAR_FOREGROUND').state,'HERO_RETURN');
assert.equal(resolveDepth(0,1440,900,-1,'HERO_RETURN').state,'HERO_ACTIVE');
console.log('PASS: geometry-relative depth, direct lower-page navigation, reverse depth symmetry, top-only emergence and hero return.');

assert.equal(footerDepth(1, 900, 800).state, null);
assert.equal(footerDepth(1, 800, 800).depth, 1);
assert.equal(footerDepth(1, 0, 800).depth, 0);
assert.equal(footerDepth(1, 0, 800).state, "FOOTER_FOREGROUND");
let lastDepth = 1;
for (let top = 800; top >= 0; top -= 8) {
  const result = footerDepth(1, top, 800);
  assert(result.depth <= lastDepth);
  assert(Math.abs(result.depth - lastDepth) < .04);
  lastDepth = result.depth;
}
console.log("PASS: smooth footer emergence with continuous geometry-based depth.");

// Reproduce a lower-page visit and a long scroll without querying layout per frame.
const listeners = new Map();
let measurements = 0, resize, disconnected = false;
globalThis.window = {
  scrollY: 0,
  addEventListener: (name, callback) => listeners.set(name, callback),
  removeEventListener: name => listeners.delete(name),
};
globalThis.ResizeObserver = class {
  constructor(callback) { resize = callback; }
  observe() {}
  disconnect() { disconnected = true; }
};
const root = { querySelector: selector => selector === '.hero-scroll'
  ? { get offsetHeight() { measurements++; return 1440; } }
  : { getBoundingClientRect() { measurements++; return { top: 8000 - window.scrollY }; } } };
const coordinator = createDepthCoordinator(root);
let visual = coordinator.update(1 / 60, 1200, 900, 0, true);
assert.equal(visual.depth, 0);
window.scrollY = 2400;
visual = coordinator.update(1 / 60, 1200, 900, 1, true);
assert.equal(visual.depth, 1);
assert(visual.submergedOpacity >= .4 && visual.submergedOpacity < .6, 'Submerged fish must remain recognisable and transparent');
assert(visual.softness > 0 && visual.softness < 4, 'Soften the fish without reducing it to a vague trace');
for (let i = 0; i < 600; i++) {
  window.scrollY = 2500 + i;
  coordinator.update(1 / 60, 1200, 900, i / 60, false);
}
assert.equal(measurements, 2, 'Scrolling must not repeatedly read content geometry');
listeners.get('fine-craft:layout')();
coordinator.update(1 / 60, 1200, 900, 11, false);
assert.equal(measurements, 4, 'ScrollTrigger refresh must invalidate cached geometry');
resize();
window.scrollY = 8000;
visual = coordinator.update(1 / 60, 1200, 900, 12, true);
assert.equal(visual.depth, 0);
assert.equal(visual.state, 'FOOTER_FOREGROUND');
coordinator.dispose();
assert(disconnected && listeners.size === 0, 'Observers and layout listeners must be cleaned up');
console.log('PASS: nonzero submerged visibility, layout caching across 600 scroll frames, refresh invalidation and footer emergence.');
