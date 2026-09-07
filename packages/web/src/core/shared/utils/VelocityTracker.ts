/** Utility for computing gesture velocity over a rolling time window. */
export class VelocityTracker {
  /** @private */ readonly #samples: Array<{ y: number; t: number }> = [];
  /** @private */ readonly #windowMs: number;

  /**
   * @param {number} [windowMs = 100] The size of the rolling sampling window in milliseconds.
   */
  constructor(windowMs: number = 100) {
    this.#windowMs = windowMs;
  }

  /**
   * Adds a new sample to the tracker.
   * @param {number} value The value in pixels.
   * @param {number} [timestamp=performance.now()] The timestamp when `value` changed.
   */
  add(value: number, timestamp: number = performance.now()): void {
    this.#samples.push({ y: value, t: timestamp });
    const cutoff = timestamp - this.#windowMs;
    while (this.#samples.length > 1 && this.#samples[0].t < cutoff) {
      this.#samples.shift();
    }
  }

  /**
   * Computes the current velocity in px/s.
   * @returns The vertical velocity in pixels per second.
   */
  getVelocity(): number {
    if (this.#samples.length < 2) return 0;
    const first = this.#samples[0];
    const last = this.#samples[this.#samples.length - 1];
    const dy = last.y - first.y;
    const dt = (last.t - first.t) / 1000;
    return dt > 0 ? dy / dt : 0;
  }

  /** Clears all stored samples. */
  reset(): void {
    this.#samples.length = 0;
  }
}
