import { GestureInputClaimant } from "./GestureInputClaimant";

/** Encapsulates state used to resolve dispositions against input. */
interface GestureInputClaim {
  readonly claims: Array<GestureInputClaimant>;
  readonly holders: Array<GestureInputClaimant>;
  readonly deferred: Array<GestureInputClaimant>;
  timeout?: number;
}

/** Provides functionality used to resolve competing claims to input. */
export class GestureInputResolver {
  /** @private */ readonly #claimants = new Array<GestureInputClaimant>();
  /** @private */ readonly #states = new Map<number, GestureInputClaim>();

  /** Whether debug logging is enabled. */
  debug: boolean = false;

  /**
   * Adds the specified claimant.
   * @param {GestureInputClaimant} claimant The claimant to add.
   */
  addClaimant(claimant: GestureInputClaimant): void {
    if (this.#claimants.includes(claimant)) return;
    this.#claimants.push(claimant);

    claimant.onDisposition = (id, disposition) => {
      this.#debug("disposition", id, claimant, { disposition });

      switch (disposition) {
        case "accept":
          this.#acceptInput(id, claimant);
          break;

        case "hold":
          this.#holdInput(id, claimant);
          break;

        case "reject":
          this.#rejectInput(id, claimant);
          break;

        case "release":
          this.#releaseInput(id, claimant);
          break;

        case "defer":
          this.#deferInput(id, claimant);
          break;
      }
    };
  }

  /**
   * Removes the specified claimant.
   * @param {GestureInputClaimant} claimant The claimant to remove.
   * @returns {boolean} `true` if `claimant` was removed; otherwise, `false`.
   */
  removeClaimant(claimant: GestureInputClaimant): boolean {
    const index = this.#claimants.indexOf(claimant);
    if (index >= 0) {
      this.#claimants.splice(index, 1);
      claimant.onDisposition = undefined;
      return true;
    }

    return false;
  }

  /**
   * Resolves outstanding dispositions against input.
   * @param {number} id The identifier of the input.
   */
  resolve(id: number): void {
    const state = this.#states.get(id);
    if (!state || state.holders.length > 0) return;

    // Attempt to resolve to the highest priority eager claimant
    let resolved: GestureInputClaimant | null = null;
    for (const claimant of state.claims) {
      if (!claimant.eager) continue;
      if (!resolved || claimant.priority > resolved.priority) {
        resolved = claimant;
      }
    }

    // If not resolved, attempt to resolve to the highest priority claimant
    if (!resolved) {
      for (const claimant of state.claims) {
        if (!resolved || claimant.priority > resolved.priority) {
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
  #removeClaim(claimant: GestureInputClaimant, state: GestureInputClaim): void {
    const index = state.claims.indexOf(claimant);
    if (index >= 0) {
      state.claims.splice(index, 1);
    }
  }

  /** @private */
  #removeHold(claimant: GestureInputClaimant, state: GestureInputClaim): boolean {
    const index = state.holders.indexOf(claimant);
    if (index >= 0) {
      state.holders.splice(index, 1);
      return true;
    }
    return false;
  }

  /** @private */
  #removeDeferred(claimant: GestureInputClaimant, state: GestureInputClaim): void {
    const index = state.deferred.indexOf(claimant);
    if (index >= 0) {
      state.deferred.splice(index, 1);
    }
  }

  /** @private */
  #acceptInput(id: number, claimant: GestureInputClaimant): void {
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

    // If eager, immediately attempt to resolve; resolution occurs after a tick supporting pending timers
    if (claimant.eager) {
      clearTimeout(state.timeout);
      state.timeout = setTimeout(() => this.resolve(id));
    }
  }

  /** @private */
  #holdInput(id: number, claimant: GestureInputClaimant): void {
    const state = this.#ensureState(id);

    if (!state.holders.includes(claimant)) {
      state.holders.push(claimant);
    }

    this.#debug("hold", id, claimant);

    // If the claimant was deferred in the past, remove it
    this.#removeDeferred(claimant, state);
  }

  /** @private */
  #rejectInput(id: number, claimant: GestureInputClaimant): void {
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
      this.resolve(id);
      return;
    }

    // Remove when no outstanding claims, holds or deferrals
    if (state) {
      this.#tryRemoveState(id, state);
    }
  }

  /** @private */
  #releaseInput(id: number, claimant: GestureInputClaimant): void {
    const state = this.#states.get(id);
    if (!state) return;

    this.#debug("release", id, claimant);

    // If the claimant was deferred in the past, remove it
    this.#removeDeferred(claimant, state);

    if (this.#removeHold(claimant, state)) {
      // Removing the last hold immediately attempts to resolve input with outstanding claims
      if (state.claims.length > 0 && state.holders.length === 0) {
        this.resolve(id);
        return;
      }
    }

    // Remove when no outstanding claims, holds, or deferrals
    this.#tryRemoveState(id, state);
  }

  /** @private */
  #deferInput(id: number, claimant: GestureInputClaimant): void {
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
  #debug(event: string, id: number, claimant?: GestureInputClaimant, data?: Record<string, unknown>): void {
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
