import { unsafeCSS } from "lit";

const EasingToken = {
  /** Emphasized transition. */
  emphasized: unsafeCSS("var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2, 0.0, 0, 1.0))"),

  /** Decelerated emphasized transition. */
  emphasizedDecelerate: unsafeCSS(
    "var(--md-sys-motion-easing-emphasized-decelerate, cubic-bezier(0.05, 0.7, 0.1, 1.0))"
  ),

  /** Accelerated emphasized transition. */
  emphasizedAccelerate: unsafeCSS(
    "var(--md-sys-motion-easing-emphasized-accelerate, cubic-bezier(0.3, 0.0, 0.8, 0.15))"
  ),

  /** Simple, small, or utility-focused transition. */
  standard: unsafeCSS("var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0.0, 0, 1.0))"),

  /** Decelerated standard transition. */
  standardDecelerate: unsafeCSS("var(--md-sys-motion-easing-standard-decelerate, cubic-bezier(0, 0, 0, 1))"),

  /** Accelerated standard transition. */
  standardAccelerate: unsafeCSS("var(--md-sys-motion-easing-standard-accelerate, cubic-bezier(0.3, 0, 1, 1))"),
} as const;

const SpringToken = {
  /** Fast spatial spring. */
  fastSpatial: unsafeCSS("var(--md-sys-motion-spring-fast-spatial, 350ms cubic-bezier(0.27, 1.06, 0.18, 1.00))"),

  /** Default spatial spring. */
  defaultSpatial: unsafeCSS("var(--md-sys-motion-spring-default-spatial, 500ms cubic-bezier(0.27, 1.06, 0.18, 1.00))"),

  /** Slow spatial spring. */
  slowSpatial: unsafeCSS("var(--md-sys-motion-spring-slow-spatial, 750ms cubic-bezier(0.27, 1.06, 0.18, 1.00))"),

  /** Fast effects spring. */
  fastEffects: unsafeCSS("var(--md-sys-motion-spring-fast-effects, 150ms cubic-bezier(0.31, 0.94, 0.34, 1.00))"),

  /** Default effects spring. */
  defaultEffects: unsafeCSS("var(--md-sys-motion-spring-default-effects, 200ms cubic-bezier(0.34, 0.80, 0.34, 1.00))"),

  /** Slow effects spring. */
  slowEffects: unsafeCSS("var(--md-sys-motion-spring-slow-effects, 200ms cubic-bezier(0.34, 0.88, 0.34, 1.00))"),
} as const;

const DurationToken = {
  /** Small utility-focused transition duration. */
  short1: unsafeCSS("var(--md-sys-motion-duration-short-1, 50ms)"),

  /** Small utility-focused transition duration. */
  short2: unsafeCSS("var(--md-sys-motion-duration-short-2, 100ms)"),

  /** Small utility-focused transition duration. */
  short3: unsafeCSS("var(--md-sys-motion-duration-short-3, 150ms)"),

  /** Small utility-focused transition duration. */
  short4: unsafeCSS("var(--md-sys-motion-duration-short-4, 200ms)"),

  /**  Duration for transitions that traverse a medium area of the screen. */
  medium1: unsafeCSS("var(--md-sys-motion-duration-medium-1, 250ms)"),

  /**  Duration for transitions that traverse a medium area of the screen. */
  medium2: unsafeCSS("var(--md-sys-motion-duration-medium-2, 300ms)"),

  /**  Duration for transitions that traverse a medium area of the screen. */
  medium3: unsafeCSS("var(--md-sys-motion-duration-medium-3, 350ms)"),

  /**  Duration for transitions that traverse a medium area of the screen. */
  medium4: unsafeCSS("var(--md-sys-motion-duration-medium-4, 400ms)"),

  /**  Duration for large expressive transitions. */
  long1: unsafeCSS("var(--md-sys-motion-duration-long-1, 450ms)"),

  /**  Duration for large expressive transitions. */
  long2: unsafeCSS("var(--md-sys-motion-duration-long-2, 500ms)"),

  /**  Duration for large expressive transitions. */
  long3: unsafeCSS("var(--md-sys-motion-duration-long-3, 550ms)"),

  /**  Duration for large expressive transitions. */
  long4: unsafeCSS("var(--md-sys-motion-duration-long-4, 600ms)"),

  /**  Extra long duration for ambient transitions. */
  extraLong1: unsafeCSS("var(--md-sys-motion-duration-extra-long-1, 700ms)"),

  /**  Extra long duration for ambient transitions. */
  extraLong2: unsafeCSS("var(--md-sys-motion-duration-extra-long-2, 800ms)"),

  /**  Extra long duration for ambient transitions. */
  extraLong3: unsafeCSS("var(--md-sys-motion-duration-extra-long-3, 900ms)"),

  /**  Extra long duration for ambient transitions. */
  extraLong4: unsafeCSS("var(--md-sys-motion-duration-extra-long-4, 1000ms)"),
} as const;

/** Design tokens that control motion. */
export const MotionToken = {
  /** Design tokens that control transition effects. */
  easing: EasingToken,

  /** Design tokens that control transition duration. */
  duration: DurationToken,

  /** Design tokens that control spring effects. */
  spring: SpringToken,
} as const;
