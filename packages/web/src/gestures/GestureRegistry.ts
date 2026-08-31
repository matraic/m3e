import { GesturePipeline } from "./GesturePipeline";
import { GestureRecognizer } from "./GestureRecognizer";
import { HtmlGestureInputSource } from "./HtmlGestureInputSource";

/**
 * Manages gesture infrastructure for DOM elements.
 * @internal
 */
export class GestureRegistry {
  /** @private */ static readonly #pipelines = new WeakMap<HTMLElement, GesturePipeline>();
  /** @private */ static readonly #sources = new WeakMap<HTMLElement, HtmlGestureInputSource>();

  /**
   * Registers a gesture recognizer for the specified DOM element.
   * @param {HTMLElement} element The DOM element to associate with the recognizer.
   * @param {GestureRecognizer} recognizer The recognizer to attach to the element's gesture pipeline.
   */
  static addRecognizer(element: HTMLElement, recognizer: GestureRecognizer): void {
    let source = this.#sources.get(element);
    if (!source) {
      source = new HtmlGestureInputSource(element);
      this.#sources.set(element, source);
    }

    let pipeline = this.#pipelines.get(element);
    if (!pipeline) {
      pipeline = new GesturePipeline(source);
      this.#pipelines.set(element, pipeline);
    }

    pipeline.addRecognizer(recognizer);
  }

  /**
   * Removes a gesture recognizer from the specified DOM element.
   * @param {HTMLElement} element The DOM element whose recognizer should be removed.
   * @param {GestureRecognizer} recognizer The recognizer to detach from the element's gesture pipeline.
   */
  static removeRecognizer(element: HTMLElement, recognizer: GestureRecognizer): void {
    const pipeline = this.#pipelines.get(element);
    if (pipeline) {
      pipeline.removeRecognizer(recognizer);

      if (pipeline.size === 0) {
        this.#pipelines.delete(element);

        const source = this.#sources.get(element);
        source?.destroy();
        this.#sources.delete(element);
      }
    }
  }
}
