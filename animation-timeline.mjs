export const SPIN_DURATION = 5000;
export const REST_YAW = -0.22;

// A time-based one-turn animation, independent of frame rate and refresh rate.
export function sampleSpin(startTime, now) {
  const elapsed = Math.max(0, Math.min(SPIN_DURATION, now - startTime));
  const progress = elapsed / SPIN_DURATION;
  const eased = progress * progress * (3 - 2 * progress);
  return { elapsed, progress, yaw: REST_YAW + Math.PI * 2 * eased, done: elapsed === SPIN_DURATION };
}
