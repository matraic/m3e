import { GestureResolver } from "./GestureResolver";
import { GestureRecognizer } from "./GestureRecognizer";
import { HtmlGestureInputSource } from "./HtmlGestureInputSource";
import { GestureRecognizerFactory } from "./GestureRecognizerFactory";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";
import { GestureDetail } from "./GestureDetail";

/**
 * Provides functionality used to manage gesture infrastructure.
 * @internal
 */
export class GestureRegistry {
  /** @private */ static readonly #factories = new Map<string, GestureRecognizerFactory>();
  /** @private */ static readonly #resolvers = new WeakMap<HTMLElement, GestureResolver>();

  /**
   * Registers a recognizer for the specified type of gesture.
   * @internal
   * @template TOptions The type of options used to recognize gestures.
   * @template TDetail The type of detail emitted for a recognized gesture.
   * @param {string} gestureType The type of gesture for which to recognize.
   * @param {GestureRecognizerFactory<TOptions, TDetail>} factory The factory used to create recognizers for the given gesture type.
   */
  static registerRecognizer<TOptions extends GestureRecognizerOptions, TDetail extends GestureDetail>(
    gestureType: string,
    factory: GestureRecognizerFactory<TOptions, TDetail>,
  ): void {
    if (window !== undefined) {
      this.#factories.set(gestureType, <GestureRecognizerFactory>factory);
    }
  }

  /**
   * Creates a recognizer for the specified type of gesture.
   * @template TOptions The type of options used to recognize gestures.
   * @template TDetail The type of detail emitted for a recognized gesture.
   * @param {string} gestureType The type of gesture for which to create a recognizer.
   * @param {Partial<TOptions> | undefined} options Options that control gesture recognition.
   * @returns {GestureRecognizer<TOptions, TDetail>} A recognizer for the specified gesture type or `null` if a recognizer could not be created.
   */
  static createRecognizer<TOptions extends GestureRecognizerOptions, TDetail extends GestureDetail>(
    gestureType: string,
    options?: Partial<TOptions>,
  ): GestureRecognizer<TOptions, TDetail> | null {
    let factory: GestureRecognizerFactory<TOptions, TDetail> | undefined = undefined;
    if (window !== undefined) {
      factory = this.#factories.get(gestureType) as GestureRecognizerFactory<TOptions, TDetail> | undefined;
    }
    return factory?.(options) ?? null;
  }

  /**
   * Registers a gesture recognizer for the specified DOM element.
   * @param {HTMLElement} element The DOM element to associate with the recognizer.
   * @param {GestureRecognizer} recognizer The recognizer to attach to the element's gesture pipeline.
   */
  static addRecognizer(element: HTMLElement, recognizer: GestureRecognizer): void {
    let resolver = this.#resolvers.get(element);
    if (!resolver) {
      resolver = new GestureResolver();
      resolver.source = new HtmlGestureInputSource(element);
      this.#resolvers.set(element, resolver);
    }

    resolver.addRecognizer(recognizer);
  }

  /**
   * Removes a gesture recognizer from the specified DOM element.
   * @param {HTMLElement} element The DOM element whose recognizer should be removed.
   * @param {GestureRecognizer} recognizer The recognizer to detach from the element's gesture pipeline.
   */
  static removeRecognizer(element: HTMLElement, recognizer: GestureRecognizer): void {
    const resolver = this.#resolvers.get(element);
    if (resolver) {
      resolver.removeRecognizer(recognizer);

      if (resolver.size === 0) {
        this.#resolvers.delete(element);
        resolver.source?.destroy();
        resolver.source = null;
      }
    }
  }
}
