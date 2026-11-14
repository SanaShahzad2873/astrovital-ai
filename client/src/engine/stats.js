export const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
/** Median Absolute Deviation, scaled (x1.4826) so it is comparable to a standard deviation. */
export const mad = (a) => { const m = median(a); return 1.4826 * median(a.map((x) => Math.abs(x - m))) || 1e-6; };
/** Robust z-score oriented so POSITIVE = worse than your own normal. */
export const zWorse = (x, med, madv, worse) => (worse * (x - med)) / madv;
export const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
export const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
