export function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

export function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a || 1e-6));
  return t * t * (3 - 2 * t);
}

export function remap(p: number, a: number, b: number) {
  return clamp01((p - a) / (b - a || 1e-6));
}

export function overshoot(t: number) {
  const c = 1.70158;
  return 1 + (t - 1) * (t - 1) * ((c + 1) * (t - 1) + c);
}
