import { GestureInput } from "./GestureInput";
import { GestureInputSource } from "./GestureInputSource";
import { GestureRecognizer } from "./GestureRecognizer";
import { PointerInput } from "./PointerInput";

/**
 * Encapsulates state used to resolve dispositions against input.
 * @private
 */
interface GestureInputClaim {
  readonly claims: Array<GestureRecognizer>;
  readonly holders: Array<GestureRecognizer>;
  readonly deferred: Array<GestureRecognizer>;
  timeout?: number;
}

/**
 * Provides functionality responsible for dispatching input to recognizers and resolving claims.
 * @internal
 */
export class GestureResolver {
  /** @private */ #source: GestureInputSource | null = null;
  /** @private */ readonly #recognizers = new Array<GestureRecognizer>();
  /** @private */ readonly #states = new Map<number, GestureInputClaim>();
  /** @private */ readonly #releasedCaptures = new Set<number>();

  /** Whether debug logging is enabled. */
  debug: boolean = false;

  /** The source from which input is received. */
  get source(): GestureInputSource | null {
    return this.#source;
  }
  set source(value: GestureInputSource | null) {
    if (this.#source) {
      this.#source.onInput = undefined;
    }
    this.#source = value;
    if (this.#source) {
      this.#source.onInput = (input) => this.#dispatchInput(input);
    }
  }

  /** The number of registered recognizers. */
  get size(): number {
    return this.#recognizers.length;
  }

  /**
   * Adds the specified recognizer.
   * @param {GestureRecognizer} recognizer The recognizer to add.
   */
  addRecognizer(recognizer: GestureRecognizer): void {
    if (this.#recognizers.includes(recognizer)) return;
    this.#recognizers.push(recognizer);
    recognizer.reset();

    recognizer.onDisposition = (id, disposition) => {
      this.#debug("disposition", id, recognizer, { disposition });

      switch (disposition) {
        case "accept":
          this.#acceptInput(id, recognizer);
          break;

        case "hold":
          this.#holdInput(id, recognizer);
          break;

        case "reject":
          this.#rejectInput(id, recognizer);
          break;

        case "release":
          this.#releaseInput(id, recognizer);
          break;

        case "defer":
          this.#deferInput(id, recognizer);
          break;
      }
    };
  }

  /**
   * Removes the specified recognizer.
   * @param {GestureRecognizer} recognizer The recognizer to remove.
   * @returns {boolean} `true` if `recognizer` was removed; otherwise, `false`.
   */
  removeRecognizer(recognizer: GestureRecognizer): boolean {
    const index = this.#recognizers.indexOf(recognizer);
    if (index >= 0) {
      this.#recognizers.splice(index, 1);
      recognizer.onDisposition = undefined;
      recognizer.reset();
      return true;
    }

    return false;
  }

  /** @private */
  #dispatchInput(input: GestureInput): void {
    if (input.type === "lostpointercapture") {
      // Ignore intentionally released pointer captures
      if (this.#releasedCaptures.has(input.id)) {
        this.#releasedCaptures.delete(input.id);
        return;
      }
      // Otherwise, convert to pointer cancel for use by recognizers
      input = { ...input, type: "pointercancel" };
    }

    // Dispatch input
    this.#recognizers.filter((x) => x.canReceiveInput(input)).forEach((x) => x.onInput(input));

    // Test each recognizer to determine whether at least one requires pointer capture.
    if (["pointerdown", "pointermove"].includes(input.type)) {
      let shouldCapturePointer = false;
      const pointerInput = <PointerInput>input;
      for (const recognizer of this.#recognizers.values()) {
        if (recognizer.shouldCapturePointer(pointerInput)) {
          shouldCapturePointer = true;
          break;
        }
      }

      if (shouldCapturePointer && !input.currentTarget.hasPointerCapture(input.id)) {
        input.currentTarget.setPointerCapture(input.id);
      }
    }
    // On terminal inputs, resolve any outstanding claims on input
    else if (["pointerup", "pointercancel"].includes(input.type)) {
      this.#resolve(input.id);

      // Release pointer capture
      if (input.currentTarget.hasPointerCapture(input.id)) {
        input.currentTarget.releasePointerCapture(input.id);
        this.#releasedCaptures.add(input.id);
      }
    }
  }

  /** @private */
  #resolve(id: number): void {
    const state = this.#states.get(id);
    if (!state || state.holders.length > 0) return;

    // Attempt to resolve to the highest priority eager claimant
    let resolved: GestureRecognizer | null = null;
    for (const claimant of state.claims) {
      if (!claimant.eager) continue;
      if (!resolved || claimant.options.priority > resolved.options.priority) {
        resolved = claimant;
      }
    }

    // If not resolved, attempt to resolve to the highest priority claimant
    if (!resolved) {
      for (const claimant of state.claims) {
        if (!resolved || claimant.options.priority > resolved.options.priority) {
          resolved = claimant;
        }
      }
    }

    if (!resolved) return;

    // Inform the claimant input is accepted
    resolved.onResolution(id, "accept");

    this.#debug("resolved", id, resolved);

    // Reject all other claims on the input
    state.claims
      .filter((x) => x !== resolved)
      .forEach((x) => {
        this.#debug("claim-rejected", id, x, { winner: resolved.gestureType });
        x.onResolution(id, "reject");
      });

    // Reject prior deferrals on the input
    state.deferred
      .filter((x) => x !== resolved)
      .forEach((x) => {
        this.#debug("deferred-rejected", id, x, { winner: resolved.gestureType });
        x.onResolution(id, "reject");
      });

    this.#removeState(id, state);
  }

  /** @private */
  #tryRemoveState(id: number, state: GestureInputClaim): void {
    if (state && state.claims.length === 0 && state.holders.length === 0 && state.deferred.length === 0) {
      this.#removeState(id, state);
    }
  }

  /** @private */
  #removeState(id: number, state: GestureInputClaim): void {
    clearTimeout(state.timeout);
    this.#states.delete(id);
  }

  /** @private */
  #ensureState(id: number): GestureInputClaim {
    let state = this.#states.get(id);
    if (!state) {
      state = { claims: [], holders: [], deferred: [] };
      this.#states.set(id, state);
    }
    return state;
  }

  /** @private */
  #removeClaim(claimant: GestureRecognizer, state: GestureInputClaim): void {
    const index = state.claims.indexOf(claimant);
    if (index >= 0) {
      state.claims.splice(index, 1);
    }
  }

  /** @private */
  #removeHold(claimant: GestureRecognizer, state: GestureInputClaim): boolean {
    const index = state.holders.indexOf(claimant);
    if (index >= 0) {
      state.holders.splice(index, 1);
      return true;
    }
    return false;
  }

  /** @private */
  #removeDeferred(claimant: GestureRecognizer, state: GestureInputClaim): void {
    const index = state.deferred.indexOf(claimant);
    if (index >= 0) {
      state.deferred.splice(index, 1);
    }
  }

  /** @private */
  #acceptInput(id: number, claimant: GestureRecognizer): void {
    const state = this.#ensureState(id);

    if (state.claims.includes(claimant)) return;

    // If the claimant was deferred in the past, remove it
    this.#removeDeferred(claimant, state);

    // When transitioning from a hold to accept, insert as a front-of-queue claim
    // Otherwise, it is appended behind other claims

    if (this.#removeHold(claimant, state)) {
      state.claims.unshift(claimant);
    } else {
      state.claims.push(claimant);
    }

    this.#debug("accept", id, claimant);

    // If eager, immediately attempt to resolve
    // Resolution occurs after a tick supporting pending timers

    if (claimant.eager) {
      clearTimeout(state.timeout);
      state.timeout = setTimeout(() => this.#resolve(id));
    }
  }

  /** @private */
  #holdInput(id: number, claimant: GestureRecognizer): void {
    const state = this.#ensureState(id);

    if (!state.holders.includes(claimant)) {
      state.holders.push(claimant);
    }

    this.#debug("hold", id, claimant);

    // If the claimant was deferred in the past, remove it
    this.#removeDeferred(claimant, state);
  }

  /** @private */
  #rejectInput(id: number, claimant: GestureRecognizer): void {
    const state = this.#states.get(id);
    let held = false;

    if (state) {
      this.#removeClaim(claimant, state);

      // Ensure holds are removed when rejected
      held = this.#removeHold(claimant, state);

      // If the claimant was deferred in the past, remove it
      this.#removeDeferred(claimant, state);
    }

    this.#debug("reject", id, claimant);

    // Inform the claimant input was rejected
    claimant.onResolution(id, "reject");

    // Rejecting the last hold immediately attempts to resolve input with outstanding claims
    if (state && held && state.claims.length > 0 && state.holders.length === 0) {
      this.#resolve(id);
      return;
    }

    // Remove when no outstanding claims, holds or deferrals
    if (state) {
      this.#tryRemoveState(id, state);
    }
  }

  /** @private */
  #releaseInput(id: number, claimant: GestureRecognizer): void {
    const state = this.#states.get(id);
    if (!state) return;

    this.#debug("release", id, claimant);

    // If the claimant was deferred in the past, remove it
    this.#removeDeferred(claimant, state);

    if (this.#removeHold(claimant, state)) {
      // Removing the last hold immediately attempts to resolve input with outstanding claims
      if (state.claims.length > 0 && state.holders.length === 0) {
        this.#resolve(id);
        return;
      }
    }

    // Remove when no outstanding claims, holds, or deferrals
    this.#tryRemoveState(id, state);
  }

  /** @private */
  #deferInput(id: number, claimant: GestureRecognizer): void {
    const state = this.#ensureState(id);

    if (!state.deferred.includes(claimant)) {
      state.deferred.push(claimant);
    }

    this.#debug("defer", id, claimant);

    // Ensure claims and holds are removed when deferred
    this.#removeClaim(claimant, state);
    this.#removeHold(claimant, state);
  }

  /** @private */
  #debug(event: string, id: number, claimant?: GestureRecognizer, data?: Record<string, unknown>): void {
    if (!this.debug) return;

    const payload = {
      event,
      input: id,
      claimant: claimant?.gestureType ?? undefined,
      ...data,
    };

    console.debug("[GestureResolver]", payload);
  }
}
