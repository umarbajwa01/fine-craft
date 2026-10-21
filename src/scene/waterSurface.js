import { skinPoint, sampleSpine } from "./swimRig.js";

const TAU = Math.PI * 2;
const noWater = { resize() {}, render() {}, dispose() {} };

// A small, seamless light texture is generated once, not recomputed per frame.
function makeCaustics() {
  const tile = document.createElement("canvas");
  const size = 192, cells = 4, spacing = size / cells;
  tile.width = tile.height = size;
  const ctx = tile.getContext("2d");
  if (!ctx) return null;
  const pixels = ctx.createImageData(size, size);
  const random = (n) => { const v = Math.sin(n * 127.1) * 43758.5453; return v - Math.floor(v); };
  const points = Array.from({ length: cells * cells }, (_, i) => ({
    x: (i % cells + 0.18 + random(i + 1) * 0.64) * spacing,
    y: (Math.floor(i / cells) + 0.18 + random(i + 37) * 0.64) * spacing,
  }));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 18 * Math.sin(TAU * 2 * y / size) + 12 * Math.sin(TAU * (2 * x + y) / size)
        + 6 * Math.sin(TAU * (3 * x - 2 * y) / size) + size) % size;
      const v = (y + 18 * Math.sin(TAU * 2 * x / size) + 13 * Math.cos(TAU * (x - 2 * y) / size)
        + 5 * Math.cos(TAU * (x + 3 * y) / size) + size) % size;
      let first = Infinity, second = Infinity;
      for (const point of points) {
        const dx = Math.min(Math.abs(u - point.x), size - Math.abs(u - point.x));
        const dy = Math.min(Math.abs(v - point.y), size - Math.abs(v - point.y));
        const distance = dx * dx + dy * dy;
        if (distance < first) { second = first; first = distance; }
        else if (distance < second) second = distance;
      }
      const gap = Math.sqrt(second) - Math.sqrt(first);
      const shimmer = 0.6 + 0.4 * Math.sin(TAU * (x + y) / size) ** 2;
      const glow = shimmer * (0.5 * Math.exp(-gap * gap / 1.3) + 0.16 * Math.exp(-gap * gap / 15));
      const index = (y * size + x) * 4;
      pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = 255;
      pixels.data[index + 3] = Math.round(glow * 255);
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return tile;
}

export function createWaterSurface(host) {
  if (!host) return noWater;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return noWater;
  const tile = makeCaustics();
  const pattern = tile && ctx.createPattern(tile, "repeat");
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  let width = 1, height = 1, resolution = 1;
  let lastTime = null, lastEmission = -1, emissionCount = 0;
  let dirty = true, wasReduced = false;
  const ripples = [];

  function lightField(time, reduced) {
    if (!pattern) return;
    ctx.fillStyle = pattern;
    for (let layer = 0; layer < 2; layer++) {
      ctx.save();
      const direction = layer ? -1 : 1;
      ctx.translate(width / 2, height / 2);
      ctx.rotate(layer * 0.47 + Math.sin(time * 0.11 + layer) * 0.06);
      ctx.scale(2.55 + layer * 0.45 + Math.sin(time * 0.17) * 0.06,
        2.15 + layer * 0.5 + Math.cos(time * 0.13) * 0.07);
      ctx.globalAlpha = (layer ? 0.045 : 0.09) * (reduced ? 0.5 : 1);
      // Wrap by the texture's exact period, avoiding jumps or unbounded drift.
      ctx.translate((time * 1.8 * direction) % 192, (time * 1.1) % 192);
      ctx.fillRect(-width * 2, -height * 2, width * 4, height * 4);
      ctx.restore();
    }
  }

  function emit(state, rig, size, u, v, strength, life) {
    const point = skinPoint(rig, u, v);
    ripples.push({
      x: state.x + point.x, y: state.y + point.y,
      angle: sampleSpine(rig, u).angle,
      radius: size.length * (u < 0.3 ? 0.035 : 0.018),
      strength, life, age: 0,
    });
    if (ripples.length > 30) ripples.shift();
  }

  function drawWake() {
    for (const ripple of ripples) {
      const progress = ripple.age / ripple.life;
      const fade = Math.sin(Math.PI * progress) * (1 - progress);
      const radius = ripple.radius + ripple.age * 24;
      ctx.save();
      ctx.translate(ripple.x - Math.cos(ripple.angle) * ripple.age * 9,
        ripple.y - Math.sin(ripple.angle) * ripple.age * 9);
      ctx.rotate(ripple.angle);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#fff";
      ctx.globalAlpha = ripple.strength * fade;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 0.58, radius, 0, Math.PI * 0.28, Math.PI * 1.72);
      ctx.stroke();
      ctx.globalAlpha *= 0.42;
      ctx.beginPath();
      ctx.ellipse(-4, 0, radius * 0.58 + 5, radius + 6, 0, Math.PI * 0.36, Math.PI * 1.64);
      ctx.stroke();
      ctx.restore();
    }
  }

  return {
    resize(w, h) {
      width = w; height = h;
      resolution = Math.min(1, 1200 / w, 900 / h);
      canvas.width = Math.max(1, Math.round(w * resolution));
      canvas.height = Math.max(1, Math.round(h * resolution));
      ripples.length = 0;
      dirty = true;
    },
    render({ state, rig, size, time, reduced = false, reveal = 1, skeleton = false }) {
      if (reduced !== wasReduced) {
        ripples.length = 0;
        lastTime = time;
        dirty = true;
        wasReduced = reduced;
      }
      const elapsed = lastTime === null ? 0 : Math.max(0, time - lastTime);
      if (!dirty && (reduced || elapsed < 1 / 30 - 0.00001)) return;
      lastTime = time;
      dirty = false;
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].age += Math.min(elapsed, 0.1);
        if (ripples[i].age >= ripples[i].life) ripples.splice(i, 1);
      }
      if (!reduced && !skeleton && reveal > 0.5 && state.speed > 12 && time - lastEmission > 0.18) {
        const effort = Math.min(1, state.speed / (size.length * 1.1));
        emit(state, rig, size, 0.12, 0.5, 0.10 + effort * 0.13, 2.1);
        if (++emissionCount % 3 === 0) {
          emit(state, rig, size, 0.76, 0.25, 0.08 + effort * 0.07, 1.35);
          emit(state, rig, size, 0.76, 0.75, 0.08 + effort * 0.07, 1.35);
        }
        lastEmission = time;
      }
      ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
      ctx.clearRect(0, 0, width, height);
      lightField(reduced ? 0 : time, reduced);
      if (!reduced) drawWake();
      ctx.globalAlpha = 1;
    },
    dispose() { ripples.length = 0; canvas.remove(); },
  };
}
