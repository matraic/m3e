import { GestureRecognizer } from "./GestureRecognizer";
import { GestureRecognizerFactory } from "./GestureRecognizerFactory";
import { GestureDetailOf, GestureRecognizerOptions } from "./GestureRecognizerOptions";

class GestureRecognizerRegistry {
  static readonly #factories = new Map<string, GestureRecognizerFactory>();

  static addFactory(gestureType: string, factory: GestureRecognizerFactory): void {
    if (window !== undefined) {
      this.#factories.set(gestureType, factory);
    }
  }

  static getFactory(gestureType: string): GestureRecognizerFactory | undefined {
    return window !== undefined ? this.#factories.get(gestureType) : undefined;
  }
}

/**
 * Registers a recognizer for the specified type of gesture.
 * @template TOptions The type of options used to recognize gestures.
 * @param {string} gestureType The type of gesture for which to recognize.
 * @param {GestureRecognizerFactory<TOptions>} factory The factory used to create recognizers for the given gesture type.
 */
export function registerGestureRecognizer<TOptions extends GestureRecognizerOptions<GestureDetailOf<TOptions>>>(
  gestureType: string,
  factory: GestureRecognizerFactory<TOptions>,
): void {
  GestureRecognizerRegistry.addFactory(gestureType, <GestureRecognizerFactory>(<unknown>factory));
}

/**
 * Creates a recognizer for the specified type of gesture.
 * @template TOptions The type of options used to recognize gestures.
 * @param {string} gestureType The type of gesture for which to create a recognizer.
 * @param {Partial<TOptions> | undefined} options Options that control gesture recognition.
 * @returns {GestureRecognizer<DetailOf<TOptions>, TOptions>} A recognizer for the specified gesture type or `null` if a recognizer could not be created.
 */
export function createGestureRecognizer<TOptions extends GestureRecognizerOptions<GestureDetailOf<TOptions>>>(
  gestureType: string,
  options?: Partial<TOptions>,
): GestureRecognizer<TOptions> | null {
  const factory = GestureRecognizerRegistry.getFactory(gestureType) as GestureRecognizerFactory<TOptions> | undefined;
  return factory?.(options) ?? null;
}
