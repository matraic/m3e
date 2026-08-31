import { GestureCallback } from "./GestureCallback";
import { GestureDetail } from "./GestureDetail";
import { GestureRecognizer } from "./GestureRecognizer";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";
import { createGestureRecognizer } from "./GestureRecognizerRegistry";
import { GestureRegistry } from "./GestureRegistry";

/**
 * Provides lifecycle and configuration control over a gesture recognizer bound to an element.
 * @template TOptions The type of options used to recognize gestures.
 * @template TDetail The type of detail emitted for a recognized gesture.
 */
export interface GestureController<
  TDetail extends GestureDetail = GestureDetail,
  TOptions extends GestureRecognizerOptions = GestureRecognizerOptions,
> {
  /** Temporarily disables gesture recognition. */
  pause(): void;

  /** Reenables gesture recognition. */
  resume(): void;

  /**
   * Updates options used to recognize gestures.
   * @param {Partial<TOptions>} options Options used to recognize gestures.
   */
  update(options: Partial<TOptions>): void;

  /** Removes the recognizer from the element and cleans up all bindings. */
  destroy(): void;

  /**
   * Replaces the gesture callback associated with the recognizer.
   * @param {GestureCallback} onGesture The new callback to invoke when a gesture is recognized.
   */
  replaceCallback(onGesture: GestureCallback<TDetail>): void;

  /** The current options used to recognize gestures. */
  readonly options: Readonly<TOptions>;

  /** The underlying recognizer instance. */
  readonly recognizer: GestureRecognizer<TOptions, TDetail>;

  /** Whether gesture recognition is currently paused. */
  readonly isPaused: boolean;

  /** Resets the recognizer's internal state. */
  reset(): void;

  /**
   * Moves gesture recognition from its current element to a new one.
   * @param {HTMLElement} element The new element to bind the recognizer to.
   */
  bindTo(element: HTMLElement): void;
}

/**
 * Attaches a gesture recognizer to an element using the specified gesture type and callback.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @param {HTMLElement} element The element to attach the recognizer to.
 * @param {string} gestureType The gesture type to instantiate.
 * @param {GestureCallback<TDetail>} onGesture Callback invoked when a gesture is recognized.
 * @returns {GestureController<TDetail>} A controller used to manage the recognizer's lifecycle and configuration.
 */
export function detectGesture<TDetail extends GestureDetail>(
  element: HTMLElement,
  gestureType: string,
  onGesture: GestureCallback<TDetail>,
): GestureController<TDetail>;

/**
 * Attaches a gesture recognizer to an element using the specified gesture type and callback.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @template TOptions The type of options used to recognize gestures.
 * @param {HTMLElement} element The element to attach the recognizer to.
 * @param {string} gestureType The gesture type to instantiate.
 * @param {TOptions} options Options used to recognize gestures.
 * @param {GestureCallback<TDetail>} onGesture Callback invoked when a gesture is recognized.
 * @returns {GestureController<TDetail>} A controller used to manage the recognizer's lifecycle and configuration.
 */
export function detectGesture<TDetail extends GestureDetail, TOptions extends GestureRecognizerOptions>(
  element: HTMLElement,
  gestureType: string,
  options: Partial<TOptions>,
  onGesture: GestureCallback<TDetail>,
): GestureController<TDetail, TOptions>;

/**
 * Internal implementation for the `detectGesture` overloads.
 *
 * @template TDetail The detail type emitted by the recognizer.
 * @template TOptions The recognizer's options type.
 */
export function detectGesture<TDetail extends GestureDetail, TOptions extends GestureRecognizerOptions>(
  element: HTMLElement,
  gestureType: string,
  optionsOrCallback: Partial<TOptions> | GestureCallback<TDetail>,
  maybeCallback?: GestureCallback<TDetail>,
): GestureController<TDetail, TOptions> {
  const hasOptions = typeof optionsOrCallback !== "function";
  const options = hasOptions ? (optionsOrCallback as Partial<TOptions>) : undefined;
  const onGesture = hasOptions ? maybeCallback! : (optionsOrCallback as GestureCallback<TDetail>);

  const recognizer = createGestureRecognizer<TOptions, TDetail>(gestureType)!;

  if (options) {
    recognizer.updateOptions(options);
  }

  GestureRegistry.addRecognizer(element, recognizer as GestureRecognizer);
  recognizer.onGesture = (detail) => onGesture(detail as TDetail);

  return {
    pause() {
      recognizer.updateOptions({ disabled: true } as Partial<TOptions>);
    },
    resume() {
      recognizer.updateOptions({ disabled: false } as Partial<TOptions>);
    },
    update(opts) {
      recognizer.updateOptions(opts);
    },
    destroy() {
      GestureRegistry.removeRecognizer(element, recognizer as GestureRecognizer);
    },
    replaceCallback(cb) {
      recognizer.onGesture = (detail) => cb(detail as TDetail);
    },
    get options() {
      return recognizer.options;
    },
    get recognizer() {
      return recognizer;
    },
    get isPaused() {
      return recognizer.options.disabled === true;
    },
    reset() {
      recognizer.reset?.();
    },
    bindTo(newElement) {
      GestureRegistry.removeRecognizer(element, recognizer as GestureRecognizer);
      GestureRegistry.addRecognizer(newElement, recognizer as GestureRecognizer);
    },
  };
}
