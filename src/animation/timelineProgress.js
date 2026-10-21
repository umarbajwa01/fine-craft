export function timelineProgress(progress) {
  const p = Math.max(0, Math.min(1, progress));
  // First milestone is already complete; leave a final hold before releasing the pin.
  const travel = Math.min(1, p / 0.9) * 3;
  const completed = Math.min(4, 1 + Math.floor(travel + 1e-8));
  return { travel, completed, active: Math.min(4, completed + 1) };
}

export const journeyScrollDistance = viewportHeight => Math.max(720, viewportHeight * 1.45);

export function timelineOverflow(listHeight, windowHeight, paddingTop = 0, paddingBottom = 0) {
  const usableHeight = Math.max(0, windowHeight - paddingTop - paddingBottom - 16);
  return Math.max(0, Math.ceil(listHeight - usableHeight));
}
