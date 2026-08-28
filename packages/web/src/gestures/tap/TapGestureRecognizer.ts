import { GestureDetail, GestureRecognizerBase, PointerInput } from "../core";

/** Encapsulates pointer detail about a tap gesture. */
export interface TapPointerGestureDetail {
  /** Identifier of the input that produced the detail. */
  readonly id: number;

  /** Timestamp the detail was detected. */
  readonly timestamp: number;

  /** Viewport x-coordinate where the tap began. */
  readonly clientX: number;

  /** Viewport y-coordinate where the tap began. */
  readonly clientY: number;

  /** Element-relative x-coordinate where the tap began. */
  readonly localX: number;

  /** Element-relative y-coordinate where the tap began. */
  readonly localY: number;

  /** The total press duration (ms). */
  readonly duration: number;
}

/** Encapsulates detail about a tap gesture. */
export interface TapGestureDetail extends GestureDetail {
  /** Tap detail for each pointer. */
  readonly pointers: ReadonlyArray<TapPointerGestureDetail>;

  /** The total press duration (ms). */
  readonly duration: number;
}

/** State used to recognize tap gestures. */
interface GestureState {
  id: number;
  clientX: number;
  clientY: number;
  localX: number;
  localY: number;
  startTime: number;
  endTime: number;
  accepted: boolean;
}

/** Recognizes a tap gesture. */
export class TapGestureRecognizer extends GestureRecognizerBase<TapGestureDetail> {
  readonly #state = new Array<GestureState>();

  /**
   * Number of pointers that must be pressed before the gesture fails.
   * @default 1
   */
  pointers: number = 1;

  /**
   * Maximum time (ms) between tap presses.
   * @default 120
   */
  maxPressInterval = 120;

  /**
   * Maximum time (ms) between tap releases.
   * @default 120
   */
  maxReleaseInterval = 120;

  /**
   * Maximum time (ms) taps can be pressed before the gesture fails.
   * @default 180
   */
  maxDuration = 180;

  /**
   * Maximum distance (px) a pointer can move before the gesture fails.
   * @default 12
   */
  maxDisplacement = 12;

  /** @inheritdoc */
  override readonly gestureType: string = "tap";

  /** @inheritdoc */
  override _onPointerDown(input: PointerInput): void {
    if (this.#state.length === this.pointers) {
      // More pointers are being tracked, remove first (shifting)
      this.#state.splice(0, 1);
    }

    // Remove state if interval check exceeded
    for (let i = this.#state.length - 1; i >= 0; i--) {
      if (input.timestamp - this.#state[i].startTime > this.maxPressInterval) {
        this.#rejectState(this.#state[i]);
      }
    }

    const bounds = input.currentTarget.getBoundingClientRect();

    this.#state.push({
      id: input.id,
      clientX: input.clientX,
      clientY: input.clientY,
      localX: input.clientX - bounds.left,
      localY: input.clientY - bounds.top,
      startTime: input.timestamp,
      endTime: input.timestamp,
      accepted: false,
    });
  }

  /** @inheritdoc */
  override _onPointerMove(input: PointerInput): void {
    const state = this.#state.find((x) => x.id === input.id);
    if (!state) return;

    // Reject if max displacement is exceeded
    const dx = input.clientX - state.clientX;
    const dy = input.clientY - state.clientY;
    const maxDispSq = this.maxDisplacement * this.maxDisplacement;
    const maxDisplacementExceeded = dx * dx + dy * dy > maxDispSq;

    if (maxDisplacementExceeded) {
      this.#rejectAll();
    }
  }

  /** @inheritdoc */
  override _onPointerUp(input: PointerInput): void {
    const state = this.#state.find((x) => x.id === input.id);
    if (!state) return;

    state.endTime = input.timestamp;

    // All pointers must be known
    if (this.#state.length !== this.pointers) return;

    // All pointers must have lifted
    if (this.#state.some((x) => x.endTime === x.startTime)) return;

    const first = this.#state[0];
    const last = this.#state[this.#state.length - 1];

    // Reject if release interval exceeded
    if (Math.abs(first.endTime - last.endTime) > this.maxReleaseInterval) {
      this.#rejectAll();
      return;
    }

    // Reject is combined tap duration exceeded
    const firstDown = Math.min(first.startTime, last.startTime);
    const lastUp = Math.max(first.endTime, last.endTime);

    if (lastUp - firstDown > this.maxDuration) {
      this.#rejectAll();
      return;
    }

    // Accepted
    this._acceptInput(input.id);
  }

  /** @inheritdoc */
  override _onPointerCancel(input: PointerInput) {
    const state = this.#state.find((x) => x.id === input.id);
    if (state) {
      this.#rejectState(state);
    }
  }

  /** @inheritdoc */
  override _onAcceptInput(id: number): void {
    const state = this.#state.find((x) => x.id === id);
    if (!state) return;

    state.accepted = true;

    // All pointers must be accepted
    if (this.#state.length !== this.pointers || !this.#state.every((x) => x.accepted)) return;

    const first = this.#state[0];
    const last = this.#state[this.#state.length - 1];

    this._emitGesture({
      id: last.id,
      gestureType: this.gestureType,
      timestamp: last.endTime,
      pointers: this.#state.map<TapPointerGestureDetail>((x) => {
        return {
          id: x.id,
          clientX: x.clientX,
          clientY: x.clientY,
          localX: x.localX,
          localY: x.localY,
          duration: x.endTime - x.startTime,
          timestamp: x.endTime,
        };
      }),
      duration: last.endTime - first.startTime,
    });
  }

  /** @inheritdoc */
  protected override _onRejectInput(id: number): void {
    if (this.#state.some((x) => x.id === id)) {
      this.reset();
    }
  }

  /** @inheritdoc */
  reset(): void {
    this.#state.length = 0;
  }

  /** @private */
  #rejectAll(): void {
    this.#state.forEach((x) => this._rejectInput(x.id));
    this.#state.length = 0;
  }

  /** @private */
  #rejectState(state: GestureState) {
    this._rejectInput(state.id);

    const index = this.#state.indexOf(state);
    if (index >= 0) {
      this.#state.splice(index, 1);
    }
  }
}
