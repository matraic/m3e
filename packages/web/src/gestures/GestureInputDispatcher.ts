import { GestureInputSink } from "./GestureInputSink";
import { GestureInputSource } from "./GestureInputSource";

/** Dispatches input from a source to one or more sinks. */
export class GestureInputDispatcher {
  /** @private */ readonly #source: GestureInputSource;
  /** @private */ readonly #sinks = new Array<GestureInputSink>();

  /**
   * Initializes a new instance of this class.
   * @param {GestureInputSource} source The source from which to dispatch input.
   */
  constructor(source: GestureInputSource) {
    this.#source = source;
    this.#source.onInput = (i) => this.#sinks.filter((x) => x.canReceiveInput(i)).forEach((x) => x.onInput(i));
  }

  /** The number of sinks to which input will be dispatched. */
  get size(): number {
    return this.#sinks.length;
  }

  /**
   * Adds the specified sink.
   * @param {GestureInputSink} sink The sink to add.
   */
  addSink(sink: GestureInputSink): void {
    if (this.#sinks.includes(sink)) return;
    this.#sinks.push(sink);
  }

  /**
   * Removes the specified sink.
   * @param {GestureInputSink} sink The sink to remove.
   * @returns {boolean} `true` if `sink` was removed; otherwise, `false`.
   */
  removeSink(sink: GestureInputSink): boolean {
    const index = this.#sinks.indexOf(sink);
    if (index >= 0) {
      this.#sinks.splice(index, 1);
      return true;
    }

    return false;
  }
}
