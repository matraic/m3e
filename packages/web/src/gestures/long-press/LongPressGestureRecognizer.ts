import { GesturePhase, GestureRecognizerBase, PointerInput, PointerTracker } from "@m3e/web/gestures";

import { LongPressGestureDetail } from "./LongPressGestureDetail";
import { DefaultLongPressGestureOptions, LongPressGestureOptions } from "./LongPressGestureOptions";

/** A {@link GestureRecognizer} used to detect and interpret long-press gestures from incoming input streams. */
export class LongPressGestureRecognizer extends GestureRecognizerBase<LongPressGestureOptions, LongPressGestureDetail> {
  /** @private */ readonly #state = new Map<
    number,
    { tracker: PointerTracker; pressTimestamp: number; accepted?: boolean }
  >();

  /** @private */ #timeout?: number;
  /** @private */ #started = false;
  /** @private */ #cancelled = false;
  /** @private */ #cancelling = false;

  /** @inheritdoc */
  override get defaultOptions(): LongPressGestureOptions {
    return { ...DefaultLongPressGestureOptions };
  }

  /** @inheritdoc */
  override get eager(): boolean {
    return true;
  }

  /** @inheritdoc */
  override shouldCapturePointer(input: PointerInput): boolean {
    return this.#state.has(input.inputId);
  }

  /** @inheritdoc */
  override _onPointerDown(input: PointerInput): void {
    // Reject duplicate input or too many pointers.
    if (this.#state.has(input.inputId) || this.#state.size >= this.options.pointers) {
      this.#cancel();
      return;
    }

    // Reject if press exceeds interval from initial press.
    if (this.#state.size > 0 && this.options.maxPressInterval > 0) {
      const initialPress = Math.min(...[...this.#state.values()].map((x) => x.pressTimestamp));
      if (input.timestamp - initialPress > this.options.maxPressInterval) {
        this.#cancel();
        return;
      }
    }

    this.#state.set(input.inputId, { tracker: new PointerTracker(input), pressTimestamp: input.timestamp });

    this._defer(input.inputId);

    if (this.#state.size === this.options.pointers) {
      // Emit start only when all pointers are down.
      this.#started = true;
      this._emit(this.#createDetail("start"));

      // Start acceptance timeout
      this.#timeout = setTimeout(() => {
        if (!this.#cancelled) {
          // Acceptance emits the final detail only after every pointer is accepted.
          for (const inputId of this.#state.keys()) {
            this._accept(inputId);
          }
        }
      }, this.options.minDuration);
    }
  }

  /** @inheritdoc */
  override _onPointerMove(input: PointerInput): void {
    // Ignore if pointer is not tracked.
    const state = this.#state.get(input.inputId);
    if (!state) return;

    state.tracker.append(input);

    // Only enforce displacement after gesture has started and not cancelled.
    if (!this.#started || this.#cancelled) return;

    // Reject when the centroid of the pointers moves beyond the allowed displacement.
    const trackers = [...this.#state.values()].map((x) => x.tracker);
    if (PointerTracker.centroid(...trackers).totalDisplacement > this.options.maxDisplacement) {
      this.#cancel();
    }
  }

  /** @inheritdoc */
  override _onPointerUp(input: PointerInput): void {
    const state = this.#state.get(input.inputId);
    if (state) {
      // If any pointer comes up before the gesture has fully ended, the long‑press must cancel.
      // If pointers are pending acceptance (other gestures have holds), these will be rejected.
      this.#cancel();
    }
  }

  /** @inheritdoc */
  override _onPointerCancel(input: PointerInput) {
    const state = this.#state.get(input.inputId);
    if (state) {
      this.#cancel();
    }
  }

  /** @inheritdoc */
  override _onAccept(inputId: number): void {
    const state = this.#state.get(inputId);
    if (!state) return;

    state.accepted = true;

    // Only emit end if gesture started, not cancelled and all inputs are accepted.
    if (this.#started && !this.#cancelled && [...this.#state.values()].every((x) => x.accepted)) {
      this._emit(this.#createDetail("end"));
      this.reset();
    }
  }

  /** @inheritdoc */
  protected override _onReject(inputId: number): void {
    if (this.#state.has(inputId)) {
      this.#cancel(inputId);
    }
  }

  /** @inheritdoc */
  reset(): void {
    clearTimeout(this.#timeout);
    this.#timeout = undefined;
    this.#state.clear();
    this.#started = false;
    this.#cancelled = false;
  }

  /** @private */
  #cancel(excludeInputId?: number): void {
    // Resolver callbacks are synchronous, so guard the rejection loop against recursive cancellation.
    if (this.#state.size === 0 || this.#cancelling) return;
    try {
      this.#cancelling = true;

      // Emit cancel if started and not yet cancelled.
      if (this.#started && !this.#cancelled) {
        this._emit(this.#createDetail("cancel"));
      }

      this.#cancelled = true;

      // Reject all inputs and reset.
      [...this.#state.keys()].filter((x) => x !== excludeInputId).forEach((x) => this._reject(x));
      this.reset();
    } finally {
      this.#cancelling = false;
    }
  }

  /** @private */
  #createDetail(phase: GesturePhase): LongPressGestureDetail {
    const trackers = [...this.#state.values()].map((x) => x.tracker);
    const centroid = PointerTracker.centroid(...trackers);
    return {
      gestureName: "long-press",
      phase,
      inputId: [...this.#state.keys()],
      timestamp: Math.max(...trackers.map((x) => x.current.timestamp)),
      clientX: centroid.clientX,
      clientY: centroid.clientY,
      localX: centroid.localX,
      localY: centroid.localY,
      duration: trackers.reduce((sum, x) => sum + x.detail.duration, 0) / trackers.length,
    };
  }
}
