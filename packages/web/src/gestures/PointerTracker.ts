import { PointerInput } from "./GestureInput";

/** Describes semantic motion metrics derived from a sequence of pointer input samples. */
export interface PointerGestureDetail {
  /** Horizontal viewport coordinate of the initial input sample. */
  readonly startClientX: number;

  /** Vertical viewport coordinate of the initial input sample. */
  readonly startClientY: number;

  /** Element-relative horizontal coordinate of the initial input sample. */
  readonly startLocalX: number;

  /** Element-relative vertical coordinate of the initial input sample. */
  readonly startLocalY: number;

  /** Horizontal viewport coordinate of the most recent input sample. */
  readonly clientX: number;

  /** Vertical viewport coordinate of the most recent input sample. */
  readonly clientY: number;

  /** Element-relative horizontal coordinate of the most recent input sample. */
  readonly localX: number;

  /** Element-relative vertical coordinate of the most recent input sample. */
  readonly localY: number;

  /** Incremental horizontal movement (px) between the last two samples. */
  readonly deltaX: number;

  /** Incremental vertical movement (px) between the last two samples. */
  readonly deltaY: number;

  /** Incremental displacement (px), computed as the Euclidean magnitude of incremental movement. */
  readonly displacement: number;

  /** Total horizontal movement (px) from the initial sample. */
  readonly totalDeltaX: number;

  /** Total vertical movement (px) from the initial sample. */
  readonly totalDeltaY: number;

  /** Total displacement (px), computed as the Euclidean magnitude of total movement. */
  readonly totalDisplacement: number;

  /** Dominant axis of movement. */
  readonly axis: "x" | "y";

  /** Instantaneous horizontal velocity (px/ms). */
  readonly velocityX: number;

  /** Instantaneous vertical velocity (px/ms). */
  readonly velocityY: number;

  /** Horizontal movement direction (-1, 0, or 1). */
  readonly directionX: number;

  /** Vertical movement direction (-1, 0, or 1). */
  readonly directionY: number;

  /** Magnitude of the velocity vector. */
  readonly speed: number;

  /** Movement angle (radians), computed from total displacement. */
  readonly angle: number;

  /** Total duration (ms) from the initial sample. */
  readonly duration: number;

  /** Duration (ms) between the last two samples. */
  readonly deltaTime: number;
}

/**
 * Tracks pointer input samples and produces semantic motion metrics for gesture recognition.
 * @template PointerInput The type of pointer input sample.
 */
export class PointerTracker {
  /** @private */ readonly #maxSamples: number;
  /** @private */ readonly #samples = new Array<PointerInput>();
  /** @private */ #detail: PointerGestureDetail;

  /**
   * Initializes a new instance of this class.
   * @param {PointerInput} initial The initial pointer input sample.
   * @param {number} [maxSamples=20] The maximum number of samples to retain.
   */
  constructor(initial: PointerInput, maxSamples: number = 1000000) {
    this.#maxSamples = Math.max(4, maxSamples);
    this.#samples.push(initial);
    this.#detail = this.#computePointerStreamDetail();
  }

  /** The most recent input sample. */
  get current(): PointerInput {
    return this.#samples[this.#samples.length - 1];
  }

  /** Semantic motion metrics derived from tracked samples. */
  get detail(): PointerGestureDetail {
    return this.#detail;
  }

  /**
   * Appends a new pointer input sample to the tracker.
   * @param {PointerInput} sample The pointer input sample to append.
   */
  append(sample: PointerInput): void {
    if (this.#maxSamples && this.#samples.length >= this.#maxSamples) {
      // Preserve first (for duration), last motion, and previous motion samples.
      const samples = this.#samples;

      let motionLast: PointerInput | undefined;
      let motionPrev: PointerInput | undefined;

      for (let i = samples.length - 1; i >= 0; i--) {
        if (samples[i].kind === "pointermove") {
          if (!motionLast) {
            motionLast = samples[i];
          } else if (!motionPrev) {
            motionPrev = samples[i];
            break;
          }
        }
      }

      const mustKeep = new Set<PointerInput>([samples[0], motionLast ?? samples[0], motionPrev ?? samples[0]]);

      // Trim oldest samples except protected ones.
      while (samples.length >= this.#maxSamples) {
        const candidate = samples[0];
        if (mustKeep.has(candidate)) {
          // Rotate protected sample to the end.
          samples.push(samples.shift()!);
        } else {
          samples.shift();
        }
      }
    }

    this.#samples.push(sample);
    this.#detail = this.#computePointerStreamDetail();
  }

  /**
   * Computes the average position of all pointers and produces motion metrics as if the
   * group of pointers were a single virtual pointer.
   * @param trackers The pointer trackers contributing to the centroid.
   * @returns A {@link PointerGestureDetail} describing centroid motion.
   */
  static centroid(...trackers: PointerTracker[]): PointerGestureDetail {
    const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;

    const samples = trackers.map((t) => t.#samples);
    const initials = samples.map((arr) => arr[0]);
    const lasts = samples.map((arr) => arr[arr.length - 1]);

    const motionPairs = samples.map((arr) => {
      let lastMove: PointerInput | undefined;
      let prevMove: PointerInput | undefined;

      for (let i = arr.length - 1; i >= 0; i--) {
        const sample = arr[i];
        if (sample.kind === "pointermove") {
          if (!lastMove) {
            lastMove = sample;
          } else {
            prevMove = sample;
            break;
          }
        }
      }

      const first = arr[0];
      if (!lastMove) lastMove = first;
      if (!prevMove) prevMove = first;

      return { lastMove, prevMove };
    });

    const motionLasts = motionPairs.map((p) => p.lastMove);
    const motionPrevs = motionPairs.map((p) => p.prevMove);

    const startClientX = avg(initials.map((s) => s.clientX));
    const startClientY = avg(initials.map((s) => s.clientY));
    const startLocalX = avg(initials.map((s) => s.localX));
    const startLocalY = avg(initials.map((s) => s.localY));

    const clientX = avg(lasts.map((s) => s.clientX));
    const clientY = avg(lasts.map((s) => s.clientY));
    const localX = avg(lasts.map((s) => s.localX));
    const localY = avg(lasts.map((s) => s.localY));

    const motionClientX = avg(motionLasts.map((s) => s.clientX));
    const motionClientY = avg(motionLasts.map((s) => s.clientY));

    const prevClientX = avg(motionPrevs.map((s) => s.clientX));
    const prevClientY = avg(motionPrevs.map((s) => s.clientY));

    const deltaX = motionClientX - prevClientX;
    const deltaY = motionClientY - prevClientY;

    const totalDeltaX = motionClientX - startClientX;
    const totalDeltaY = motionClientY - startClientY;

    const lastTimestamp = Math.max(...lasts.map((s) => s.timestamp));
    const motionLastTs = Math.max(...motionLasts.map((s) => s.timestamp));
    const motionPrevTs = Math.max(...motionPrevs.map((s) => s.timestamp));
    const firstTimestamp = Math.min(...initials.map((s) => s.timestamp));

    const deltaTime = motionLastTs - motionPrevTs;
    const duration = lastTimestamp - firstTimestamp;

    const velocityX = deltaTime > 0 ? deltaX / deltaTime : 0;
    const velocityY = deltaTime > 0 ? deltaY / deltaTime : 0;

    return {
      startClientX,
      startClientY,
      startLocalX,
      startLocalY,
      clientX,
      clientY,
      localX,
      localY,
      deltaX,
      deltaY,
      displacement: Math.hypot(deltaX, deltaY),
      totalDeltaX,
      totalDeltaY,
      totalDisplacement: Math.hypot(totalDeltaX, totalDeltaY),
      axis: Math.abs(totalDeltaX) >= Math.abs(totalDeltaY) ? "x" : "y",
      velocityX,
      velocityY,
      directionX: Math.sign(totalDeltaX),
      directionY: Math.sign(totalDeltaY),
      speed: Math.hypot(velocityX, velocityY),
      angle: totalDeltaX === 0 && totalDeltaY === 0 ? 0 : Math.atan2(totalDeltaY, totalDeltaX),
      duration,
      deltaTime,
    };
  }

  /** @private */
  #computePointerStreamDetail(): PointerGestureDetail {
    const first = this.#samples[0];
    const last = this.#samples[this.#samples.length - 1];

    let motionLast: PointerInput | undefined;
    let motionPrev: PointerInput | undefined;

    for (let i = this.#samples.length - 1; i >= 0; i--) {
      const sample = this.#samples[i];
      if (sample.kind === "pointermove") {
        if (!motionLast) {
          motionLast = sample;
        } else {
          motionPrev = sample;
          break;
        }
      }
    }

    if (!motionLast) motionLast = first;
    if (!motionPrev) motionPrev = first;

    const deltaX = motionLast.clientX - motionPrev.clientX;
    const deltaY = motionLast.clientY - motionPrev.clientY;
    const totalDeltaX = motionLast.clientX - first.clientX;
    const totalDeltaY = motionLast.clientY - first.clientY;
    const deltaTime = motionLast.timestamp - motionPrev.timestamp;
    const duration = last.timestamp - first.timestamp;
    const velocityX = deltaTime > 0 ? deltaX / deltaTime : 0;
    const velocityY = deltaTime > 0 ? deltaY / deltaTime : 0;

    return {
      startClientX: first.clientX,
      startClientY: first.clientY,
      startLocalX: first.localX,
      startLocalY: first.localY,
      clientX: last.clientX,
      clientY: last.clientY,
      localX: last.localX,
      localY: last.localY,
      deltaX,
      deltaY,
      displacement: Math.hypot(deltaX, deltaY),
      totalDeltaX,
      totalDeltaY,
      totalDisplacement: Math.hypot(totalDeltaX, totalDeltaY),
      axis: Math.abs(totalDeltaX) >= Math.abs(totalDeltaY) ? "x" : "y",
      velocityX,
      velocityY,
      directionX: Math.sign(totalDeltaX),
      directionY: Math.sign(totalDeltaY),
      speed: Math.hypot(velocityX, velocityY),
      angle: totalDeltaX === 0 && totalDeltaY === 0 ? 0 : Math.atan2(totalDeltaY, totalDeltaX),
      duration,
      deltaTime,
    };
  }
}
