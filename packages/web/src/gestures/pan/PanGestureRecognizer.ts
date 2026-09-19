import { GesturePhase, GestureRecognizerBase, PointerInput, PointerTracker } from "@m3e/web/gestures";

import { PanGestureDetail } from "./PanGestureDetail";
import { DefaultPanGestureOptions, PanGestureOptions } from "./PanGestureOptions";

/** A {@link GestureRecognizer} used to detect and interpret pan gestures from incoming input streams. */
export class PanGestureRecognizer extends GestureRecognizerBase<PanGestureOptions, PanGestureDetail> {
  /** @private */ readonly #state = new Map<
    number,
    {
      active: boolean;
      tracker: PointerTracker;
      pressTimestamp: number;
      accepted?: boolean;
    }
  >();

  /** @private */ #invalid: boolean = false;
  /** @private */ #axis: "x" | "y" | null = null;
  /** @private */ #timeout?: number;
  /** @private */ #started = false;
  /** @private */ #cancelled = false;
  /** @private */ #cancelling = false;

  /** Returns the pointer trackers for all active pointers. */
  get trackers(): PointerTracker[] {
    return [...this.#state.values()].map((s) => s.tracker);
  }

  /** @inheritdoc */
  override get defaultOptions(): PanGestureOptions {
    return { ...DefaultPanGestureOptions };
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

    this.#state.set(input.inputId, {
      active: true,
      tracker: new PointerTracker(input),
      pressTimestamp: input.timestamp,
    });

    // If activation mode is move and a pointer down occurs, the state is invalid.
    this.#invalid = this.options.activationMode === "move";
    if (!this.#invalid) {
      this._defer(input.inputId);
    }
  }

  /** @inheritdoc */
  override _onPointerMove(input: PointerInput): void {
    // Ignore if invalid.
    if (this.#invalid) return;

    // If activation mode is move and there is no state, capture initial state.
    if (!this.#state.has(input.inputId) && this.options.activationMode === "move") {
      this.#state.set(input.inputId, {
        active: true,
        tracker: new PointerTracker(input),
        pressTimestamp: input.timestamp,
      });

      this._defer(input.inputId);
    }

    const state = this.#state.get(input.inputId);

    // Ignore if no state, all pointers are not down, or all pointers are not active.
    if (!state || this.#state.size !== this.options.pointers || ![...this.#state.values()].every((x) => x.active)) {
      return;
    }

    // Update state with new input.
    state.tracker.append(input);

    if (this.#started) {
      // When started, optionally lock axis.
      this.#tryLockAxis();

      const trackers = [...this.#state.values()].map((x) => x.tracker);
      const centroid = PointerTracker.centroid(...trackers);

      // Don’t emit move if perpendicular movement is below the delta threshold.
      switch (this.#axis) {
        case "x":
          if (Math.abs(centroid.deltaY) < this.options.deltaThreshold) {
            return;
          }
          break;

        case "y":
          if (Math.abs(centroid.deltaX) < this.options.deltaThreshold) {
            return;
          }
          break;
      }

      // Dispatch updates.
      this._emit(this.#createDetail("update"));
      return;
    }

    const trackers = [...this.#state.values()].map((x) => x.tracker);
    const centroid = PointerTracker.centroid(...trackers);

    // Ensure min displacement and prior to activation.
    if (centroid.totalDisplacement >= this.options.minDisplacement) {
      // Lock axis before activation.
      this.#tryLockAxis();

      // Start gesture.
      this.#started = true;
      this._emit(this.#createDetail("start"));
    }
  }

  /** @inheritdoc */
  override _onPointerUp(input: PointerInput): void {
    // Ignore if no state.
    const state = this.#state.get(input.inputId);
    if (!state) return;

    state.active = false;

    // If started and all pointers are no longer active, accept the gesture (which ends on acceptance).
    if (this.#started) {
      if (![...this.#state.values()].every((x) => x.active)) {
        state.tracker.append(input);
        this._accept([...this.#state.keys()]);
      }
    } else {
      this.#cancel();
    }
  }

  /** @inheritdoc */
  override _onPointerCancel(input: PointerInput): void {
    const state = this.#state.get(input.inputId);
    if (state) {
      this.#cancel();
    }
  }

  /** @inheritdoc */
  protected override _onAccept(inputId: number): void {
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
  override reset(): void {
    clearTimeout(this.#timeout);
    this.#timeout = undefined;
    this.#state.clear();
    this.#invalid = false;
    this.#started = false;
    this.#cancelled = false;
    this.#axis = null;
  }

  /** @private */
  #tryLockAxis(): void {
    if (this.options.lockAxis === "x" || this.options.lockAxis === "y") {
      this.#axis = this.options.lockAxis;
      return;
    }

    if (this.options.lockAxis !== "auto" || this.#axis) return;

    // Lock axis only after threshold displacement.
    const trackers = [...this.#state.values()].map((x) => x.tracker);
    const centroid = PointerTracker.centroid(...trackers);
    if (centroid.totalDisplacement >= this.options.axisThreshold) {
      this.#axis = centroid.axis;
    }
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
  #createDetail(phase: GesturePhase): PanGestureDetail {
    const trackers = [...this.#state.values()].map((x) => x.tracker);
    const centroid = PointerTracker.centroid(...trackers);
    return {
      gestureName: "pan",
      phase: phase,
      inputId: [...this.#state.keys()],
      ...centroid,
      timestamp: Math.max(...trackers.map((x) => x.current.timestamp)),
    };
  }
}
