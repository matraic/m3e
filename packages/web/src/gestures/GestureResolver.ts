import { GestureDisposition, GestureRecognizer } from "./GestureRecognizer";

/**
 * Resolves competing claims on input and issues resolutions to recognizers.
 * @internal
 */
export class GestureResolver {
  /** @private */ readonly #recognizers = new Array<GestureRecognizer>();
  /** @private */ readonly #streams = new Map<
    number,
    {
      /** Recognizers that have accepted the input stream. */
      acceptors: Array<GestureRecognizer>;

      /** Recognizers that have holds on the input stream. */
      holders: Array<GestureRecognizer>;

      /** Recognizers that have deferred decisions on the input stream. */
      deferrers: Array<GestureRecognizer>;

      /** Timeout for pending resolution of the input stream. */
      timeout?: number;
    }
  >();

  /** The recognizers registered to the resolver. */
  get recognizers(): readonly GestureRecognizer[] {
    return this.#recognizers;
  }

  /**
   * Registers a recognizer with the resolver.
   * @param {GestureRecognizer}  recognizer The recognizer to register with the resolver.
   */
  addRecognizer(recognizer: GestureRecognizer): void {
    if (!this.#recognizers.includes(recognizer)) {
      recognizer.reset();

      this.#recognizers.push(recognizer);
      recognizer.onDisposition = this.#onDisposition.bind(this, recognizer);
    }
  }

  /**
   * Unregisters a recognizer from the resolver.
   * @param {GestureRecognizer} recognizer The recognizer to unregister from the resolver.
   */
  removeRecognizer(recognizer: GestureRecognizer): void {
    const index = this.#recognizers.indexOf(recognizer);
    if (index >= 0) {
      recognizer.reset();

      this.#recognizers.splice(index, 1);
      recognizer.onDisposition = undefined;
    }
  }

  /**
   * Resolves outstanding dispositions for the given input stream.
   * @param {number} inputId The identifier of the input stream to resolve.
   */
  resolve(inputId: number): void {
    const stream = this.#streams.get(inputId);

    // Input cannot be resolved when there are holds.
    if (!stream || stream.holders.length > 0) return;

    // Find the first eager recognizer with highest priority.
    let resolved: GestureRecognizer | null = null;
    for (const recognizer of stream.acceptors) {
      if (!recognizer.eager) continue;
      if (!resolved || recognizer.options.priority > resolved.options.priority) {
        resolved = recognizer;
      }
    }

    // If there are no eager recognizers, fallback the recognizer with highest priority.
    if (!resolved) {
      for (const recognizer of stream.acceptors) {
        if (!resolved || recognizer.options.priority > resolved.options.priority) {
          resolved = recognizer;
        }
      }
    }

    if (!resolved) return;

    // Notify the recognizer that input can be accepted.
    resolved.onResolution(inputId, "accept");

    this.#exclude(resolved, stream.acceptors);

    // Notify remaining acceptors and any deferrers that input should be rejected.
    stream.acceptors.forEach((x) => x.onResolution(inputId, "reject"));
    stream.deferrers.forEach((x) => x.onResolution(inputId, "reject"));

    clearTimeout(stream.timeout);
    this.#streams.delete(inputId);
  }

  /** Clears any dispositions on input . */
  clear(): void {
    this.#streams.clear();
  }

  /** Removes all recognizers and clears any dispositions on input. */
  destroy(): void {
    this.#recognizers.forEach((x) => this.removeRecognizer(x));
    this.#streams.clear();
  }

  /** @private */
  #onDisposition(recognizer: GestureRecognizer, inputId: number, disposition: GestureDisposition): void {
    switch (disposition) {
      case "accept":
        this.#onAccept(recognizer, inputId);
        break;

      case "reject":
        this.#onReject(recognizer, inputId);
        break;

      case "hold":
        this.#onHold(recognizer, inputId);
        break;

      case "release":
        this.#onRelease(recognizer, inputId);
        break;

      case "defer":
        this.#onDefer(recognizer, inputId);
        break;
    }
  }

  /** @private */
  #onAccept(recognizer: GestureRecognizer, inputId: number): void {
    const stream = this.#streams.get(inputId) ?? { acceptors: [], holders: [], deferrers: [] };
    this.#streams.set(inputId, stream);

    if (stream.acceptors.includes(recognizer)) return;

    this.#exclude(recognizer, stream.deferrers);

    // If recognizer was a holder, move them to the front of the acceptor queue; otherwise append.
    if (this.#exclude(recognizer, stream.holders)) {
      stream.acceptors.unshift(recognizer);
    } else {
      stream.acceptors.push(recognizer);
    }

    // If eager, immediately attempt to resolve; wait a tick to support pending timers.
    if (recognizer.eager) {
      clearTimeout(stream.timeout);
      stream.timeout = setTimeout(() => this.resolve(inputId));
    }
  }

  /** @private */
  #onReject(recognizer: GestureRecognizer, inputId: number): void {
    let held = false;
    const stream = this.#streams.get(inputId);

    if (stream) {
      this.#exclude(recognizer, stream.acceptors);
      this.#exclude(recognizer, stream.deferrers);
      held = this.#exclude(recognizer, stream.holders);
    }

    // Notify recognizer input was rejected, regardless of stream existence.
    recognizer.onResolution(inputId, "reject");

    if (!stream) return;

    // Resolve input if the rejecting recognizer had a hold, no further holds exist, and one or more acceptors exist;
    // otherwise, remove the stream if there are no further acceptors, holders or deferrers.

    if (held && stream.acceptors.length > 0 && stream.holders.length === 0) {
      this.resolve(inputId);
    } else if (stream.acceptors.length === 0 && stream.holders.length === 0 && stream.deferrers.length === 0) {
      clearTimeout(stream.timeout);
      this.#streams.delete(inputId);
    }
  }

  /** @private */
  #onHold(recognizer: GestureRecognizer, inputId: number): void {
    const stream = this.#streams.get(inputId) ?? { acceptors: [], holders: [], deferrers: [] };
    this.#streams.set(inputId, stream);
    this.#include(recognizer, stream.holders);
    this.#exclude(recognizer, stream.deferrers);
  }

  /** @private */
  #onRelease(recognizer: GestureRecognizer, inputId: number): void {
    const stream = this.#streams.get(inputId);
    if (!stream) return;

    this.#exclude(recognizer, stream.deferrers);

    // Resolve input if the releasing recognizer had a hold, no further holds exist, and one or more acceptors exist;
    // otherwise, remove the stream if there are no further acceptors, holders or deferrers.

    if (this.#exclude(recognizer, stream.holders) && stream.acceptors.length > 0 && stream.holders.length === 0) {
      this.resolve(inputId);
    } else if (stream.acceptors.length === 0 && stream.holders.length === 0 && stream.deferrers.length === 0) {
      clearTimeout(stream.timeout);
      this.#streams.delete(inputId);
    }
  }

  /** @private */
  #onDefer(recognizer: GestureRecognizer, inputId: number): void {
    const stream = this.#streams.get(inputId) ?? { acceptors: [], holders: [], deferrers: [] };
    this.#streams.set(inputId, stream);
    this.#include(recognizer, stream.deferrers);
    this.#exclude(recognizer, stream.acceptors);
    this.#exclude(recognizer, stream.holders);
  }

  /** @private */
  #exclude(recognizer: GestureRecognizer, disposition: Array<GestureRecognizer>): boolean {
    const index = disposition.indexOf(recognizer);
    if (index < 0) return false;
    disposition.splice(index, 1);
    return true;
  }

  /** @private */
  #include(recognizer: GestureRecognizer, disposition: Array<GestureRecognizer>): void {
    if (!disposition.includes(recognizer)) {
      disposition.push(recognizer);
    }
  }
}
