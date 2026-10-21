export const DEPTH_SETTINGS = Object.freeze({ exitStart: .06, exitEnd: .62, emergence: .12, damping: 7, submergedOpacity: .46, softness: 2.4 });
const clamp = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

// Geometry-relative boundaries remain valid after resize and anchor navigation.
export function resolveDepth(scrollY, heroHeight, viewportHeight, direction, previous = "HERO_ACTIVE") {
  const range = Math.max(viewportHeight * .5, heroHeight - viewportHeight);
  const progress = clamp(scrollY / range);
  const depth = smooth((progress - DEPTH_SETTINGS.exitStart) / (DEPTH_SETTINGS.exitEnd - DEPTH_SETTINGS.exitStart));
  let state;
  if (depth >= .999) state = "CONTENT_UNDERLAY";
  else if (direction < 0 && progress > DEPTH_SETTINGS.emergence) state = "NAVBAR_APPROACH";
  else if (direction < 0 && progress > .015) state = "NAVBAR_FOREGROUND";
  else if (progress <= .015 && /NAVBAR/.test(previous)) state = "HERO_RETURN";
  else if (depth > .001) state = "HERO_EXIT";
  else state = "HERO_ACTIVE";
  return { state, depth, progress };
}

export function footerDepth(baseDepth, footerTop, viewportHeight) {
  if (footerTop >= viewportHeight) return { depth: baseDepth, state: null };
  const emergence = smooth((viewportHeight - footerTop) / (viewportHeight * .65));
  return { depth: baseDepth * (1 - emergence), state: emergence > .98 ? "FOOTER_FOREGROUND" : "FOOTER_APPROACH" };
}

export function createDepthCoordinator(root) {
  if (!root) return { update: () => null, dispose() {} };
  const hero = root.querySelector(".hero-scroll");
  const footer = root.querySelector(".site-footer");
  let previousY = window.scrollY, direction = 1, state = "HERO_ACTIVE", depth = 0;
  let layoutDirty = true, heroHeight = 0, footerY = Infinity, lastWidth = 0, lastHeight = 0;
  const invalidate = () => { layoutDirty = true; };
  const observer = new ResizeObserver(invalidate);
  observer.observe(root);
  window.addEventListener("fine-craft:layout", invalidate);
  return {
    update(dt, width, height, _time, reduced) {
      const y = window.scrollY;
      // Measure after layout/viewport changes, never after each scroll write.
      if (layoutDirty || width !== lastWidth || height !== lastHeight) {
        heroHeight = hero?.offsetHeight || height;
        footerY = footer ? footer.getBoundingClientRect().top + y : Infinity;
        layoutDirty = false; lastWidth = width; lastHeight = height;
      }
      if (Math.abs(y - previousY) > 1.5) direction = Math.sign(y - previousY);
      previousY = y;
      const next = resolveDepth(y, heroHeight, height, direction, state);
      if (footer) {
        const footerVisual = footerDepth(next.depth, footerY - y, height);
        if (footerVisual.state) Object.assign(next, footerVisual);
      }
      state = next.state;
      depth += (next.depth - depth) * (reduced ? 1 : 1 - Math.exp(-DEPTH_SETTINGS.damping * dt));
      return { state, depth, submergedOpacity: DEPTH_SETTINGS.submergedOpacity, softness: DEPTH_SETTINGS.softness };
    },
    dispose() { observer.disconnect(); window.removeEventListener("fine-craft:layout", invalidate); },
  };
}
