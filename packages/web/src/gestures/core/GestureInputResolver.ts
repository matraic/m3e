import { GestureInputClaimant } from "./GestureInputClaimant";

/** Encapsulates state used to resolve dispositions against input. */
interface GestureInputClaim {
  readonly claims: Array<GestureInputClaimant>;
  readonly holders: Array<GestureInputClaimant>;
  timeout?: number;
}

/** Provides functionality used to resolve competing claims to input. */
export class GestureInputResolver {
  /** @private */ readonly #claimants = new Array<GestureInputClaimant>();
  /** @private */ readonly #states = new Map<number, GestureInputClaim>();

  /**
   * Adds the specified claimant.
   * @param {GestureInputClaimant} claimant The claimant to add.
   */
  addClaimant(claimant: GestureInputClaimant): void {
    if (this.#claimants.includes(claimant)) return;
    this.#claimants.push(claimant);

    claimant.onDisposition = (id, disposition) => {
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

    // Reject all other claims on the input
    state.claims.filter((x) => x !== resolved).forEach((x) => x.onResolution(id, "reject"));

    this.#removeState(id, state);
  }

  /** @private */
  #removeState(id: number, state: GestureInputClaim): void {
    clearTimeout(state.timeout);
    this.#states.delete(id);
  }

  /** @private */
  #acceptInput(id: number, claimant: GestureInputClaimant): void {
    let state = this.#states.get(id);
    if (!state) {
      state = { claims: [], holders: [] };
      this.#states.set(id, state);
    }

    if (state.claims.includes(claimant)) return;

    // When transitioning from a hold to accept, insert as a front-of-queue claim
    // Otherwise, it is appended behind other claims

    const index = state.holders.indexOf(claimant);
    if (index >= 0) {
      state.holders.splice(index, 1);
      state.claims.unshift(claimant);
    } else {
      state.claims.push(claimant);
    }

    // If eager, immediately attempt to resolve; resolution occurs after a tick supporting pending timers
    if (claimant.eager) {
      clearTimeout(state.timeout);
      state.timeout = setTimeout(() => this.resolve(id));
    }
  }

  /** @private */
  #holdInput(id: number, claimant: GestureInputClaimant): void {
    let state = this.#states.get(id);
    if (!state) {
      state = { claims: [], holders: [] };
      this.#states.set(id, state);
    }
    if (!state.holders.includes(claimant)) {
      state.holders.push(claimant);
    }
  }

  /** @private */
  #rejectInput(id: number, claimant: GestureInputClaimant): void {
    const state = this.#states.get(id);
    let held = false;
    if (state) {
      let index = state.claims.indexOf(claimant);
      if (index >= 0) {
        state.claims.splice(index, 1);
      }

      // Ensure holds are removed when rejected
      index = state.holders.indexOf(claimant);
      if (index >= 0) {
        state.holders.splice(index, 1);
        held = true;
      }
    }

    // Inform the claimant input was rejected
    claimant.onResolution(id, "reject");

    // Rejecting the last hold immediately attempts to resolve input with outstanding claims
    if (state && held && state.claims.length > 0 && state.holders.length === 0) {
      this.resolve(id);
      return;
    }

    // Remove when no outstanding claims or holds
    if (state && state.claims.length === 0 && state.holders.length === 0) {
      this.#removeState(id, state);
    }
  }

  /** @private */
  #releaseInput(id: number, claimant: GestureInputClaimant): void {
    const state = this.#states.get(id);
    if (!state) return;

    const index = state.holders.indexOf(claimant);
    if (index >= 0) {
      state.holders.splice(index, 1);

      // Removing the last hold immediately attempts to resolve input with outstanding claims
      if (state.claims.length > 0 && state.holders.length === 0) {
        this.resolve(id);
        return;
      }
    }

    // Remove when no outstanding claims or holds
    if (state.claims.length === 0 && state.holders.length === 0) {
      this.#removeState(id, state);
    }
  }
}
