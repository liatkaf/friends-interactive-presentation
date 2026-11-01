export const SPIN_DURATION = 5000;
export const REST_YAW = -0.22;

// Continuous rotation advances only by visible-frame time, with no angle wrapping.
export function advanceYaw(yaw, elapsedMs, speed = 0.22) {
  return yaw + Math.max(0, Math.min(100, elapsedMs)) / 1000 * speed;
}
export function approachSpeed(current, target, elapsedMs) {
  return current + (target-current) * (1-Math.exp(-Math.max(0,Math.min(100,elapsedMs))/450));
}

// A time-based one-turn animation, independent of frame rate and refresh rate.
export function sampleSpin(startTime, now) {
  const elapsed = Math.max(0, Math.min(SPIN_DURATION, now - startTime));
  const progress = elapsed / SPIN_DURATION;
  const eased = progress * progress * (3 - 2 * progress);
  return { elapsed, progress, yaw: REST_YAW + Math.PI * 2 * eased, done: elapsed === SPIN_DURATION };
}
