import type { SwipeRevealDismiss } from "./SwipeRevealDismiss";

/** Specifies default values for swipe-reveal and swipe-reveal-group properties. */
export const SwipeRevealDefaults = {
  stagger: 0,
  staggerCount: 3,
  threshold: 0.5,
  overshoot: 8,
  triggers: ["swipe"],
  dismissible: null as SwipeRevealDismiss,
  dismissThreshold: 0.6,
} as const;
