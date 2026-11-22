/**
 * Normalizes measurable wavy progress without changing flat-variant progress handling.
 * @internal
 */
export function wavyProgress(value: number, max: number): number {
  return max > 0 ? Math.max(0, Math.min(value / max, 1)) : 0;
}

/**
 * Selects the configured amplitude for activity or middle progress, and zero near either end.
 * @internal
 */
export function wavyAmplitudeTarget(progress: number, amplitude: number, indeterminate: boolean): number {
  return indeterminate || (progress > 0.1 && progress < 0.95) ? Math.max(0, amplitude) : 0;
}

/**
 * Samples a CSS cubic-bezier easing curve at normalized elapsed time.
 * Inverts the curve's x coordinate before evaluating y, rather than treating time as the curve parameter.
 * @param progress Elapsed time as a fraction from 0 to 1.
 * @internal
 */
export function cubicEasing(progress: number, x1: number, y1: number, x2: number, y2: number): number {
  if (progress <= 0 || progress >= 1) return progress;

  let low = 0;
  let high = 1;

  for (let i = 0; i < 20; i++) {
    const t = (low + high) / 2;
    const x = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;

    if (x < progress) {
      low = t;
    } else {
      high = t;
    }
  }

  const t = (low + high) / 2;
  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
}

/**
 * Tracks a retargetable 500ms amplitude morph, using time in seconds.
 *
 * The first target is applied immediately. Subsequent targets use distinct growing and flattening easings,
 * and interrupted transitions restart from the currently sampled amplitude.
 * The caller supplies monotonic time and owns the animation loop.
 *
 * @internal
 */
export class WavyAmplitude {
  /** The interpolated component amplitude, or `undefined` before the first target is supplied. */
  value?: number;

  #target = 0;
  #from = 0;

  /** The transition's time origin; `undefined` means idle, while zero is a valid start time. */
  #start?: number;

  /** Whether the latest target transition still needs to be sampled. */
  get animating(): boolean {
    return this.#start !== undefined;
  }

  /**
   * Applies an initial amplitude immediately or starts a transition to a new target.
   * @param target The component's desired amplitude.
   * @param time Monotonic time in seconds.
   */
  setTarget(target: number, time: number): void {
    if (this.value === undefined) {
      this.value = this.#target = target;
    } else if (target !== this.#target) {
      // Retarget from the shape at this instant, not from the previous animation's destination.
      this.sample(time);
      this.#from = this.value;
      this.#target = target;
      this.#start = time;
    }
  }

  /**
   * Advances the transition and settles exactly on its target when complete.
   * @param time Monotonic time in seconds.
   * @returns Whether the amplitude changed, allowing the caller to skip unnecessary renders.
   */
  sample(time: number): boolean {
    if (this.#start === undefined) return false;

    const previous = this.value;
    const progress = Math.max(0, Math.min(1, (time - this.#start) / 0.5));
    const eased =
      this.#target > this.#from ? cubicEasing(progress, 0.2, 0, 0, 1) : cubicEasing(progress, 0.3, 0, 0.8, 0.15);

    this.value = this.#from + (this.#target - this.#from) * eased;

    if (progress === 1) {
      this.value = this.#target;
      this.#start = undefined;
    }

    return this.value !== previous;
  }

  /** Discards the transition so the next target initializes without animating from stale state. */
  reset(): void {
    this.value = undefined;
    this.#start = undefined;
  }
}
