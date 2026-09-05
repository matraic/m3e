import { GestureCallback } from "./GestureCallback";
import { GestureDetail } from "./GestureDetail";
import { GestureRecognizer } from "./GestureRecognizer";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";
import { GestureRegistry } from "./GestureRegistry";

/**
 * Provides lifecycle and configuration control over a gesture recognizer bound to an element.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @template TOptions The type of options used to recognize gestures.
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
   * Attaches the controller to the specified element
   * @param {HTMLElement} element The element to attach.
   */
  attach(element: HTMLElement): void;

  /** Detaches the controller from the previously attached element. */
  detach(): void;
}

/**
 * Creates a gesture recognizer of the given type and returns a controller that manages its lifecycle.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @param {string} gestureType The gesture type to instantiate.
 * @param {GestureCallback<TDetail>} onGesture Callback invoked when a gesture is recognized.
 * @returns {GestureController<TDetail, TOptions>} A `GestureController` used to configure, bind, and manage the recognizer.
 */
export function detectGesture<TDetail extends GestureDetail>(
  gestureType: string,
  onGesture: GestureCallback<TDetail>,
): GestureController<TDetail>;

/**
 * Creates a gesture recognizer of the given type and returns a controller that manages its lifecycle.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @template TOptions The type of options used to recognize gestures.
 * @param {string} gestureType The gesture type to instantiate.
 * @param {TOptions} options Options used to recognize gestures.
 * @param {GestureCallback<TDetail>} onGesture Callback invoked when a gesture is recognized.
 * @returns {GestureController<TDetail, TOptions>} A `GestureController` used to configure, bind, and manage the recognizer.
 */
export function detectGesture<TDetail extends GestureDetail, TOptions extends GestureRecognizerOptions>(
  gestureType: string,
  options: Partial<TOptions>,
  onGesture: GestureCallback<TDetail>,
): GestureController<TDetail, TOptions>;

/**
 * Creates a gesture recognizer of the given type and returns a controller that manages its lifecycle.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @template TOptions The type of options used to recognize gestures.
 * @param {string} gestureType The gesture type to instantiate.
 * @param {Partial<TOptions> | GestureCallback<TDetail>} optionsOrCallback Either the recognizer options or the gesture callback.
 * @param {GestureCallback<TDetail> | undefined} maybeCallback The gesture callback when options are provided.
 * @returns {GestureController<TDetail, TOptions>} A `GestureController` used to configure, bind, and manage the recognizer.
 */
export function detectGesture<TDetail extends GestureDetail, TOptions extends GestureRecognizerOptions>(
  gestureType: string,
  optionsOrCallback: Partial<TOptions> | GestureCallback<TDetail>,
  maybeCallback?: GestureCallback<TDetail>,
): GestureController<TDetail, TOptions> {
  const hasOptions = typeof optionsOrCallback !== "function";
  const options = hasOptions ? (optionsOrCallback as Partial<TOptions>) : undefined;
  const onGesture = hasOptions ? maybeCallback! : (optionsOrCallback as GestureCallback<TDetail>);
  const recognizer = GestureRegistry.createRecognizer<TOptions, TDetail>(gestureType)!;

  if (options) {
    recognizer.updateOptions(options);
  }

  recognizer.onGesture = (detail) => onGesture(detail as TDetail);

  let attachedElement: HTMLElement | null = null;

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
    attach(element) {
      if (attachedElement) {
        GestureRegistry.removeRecognizer(attachedElement, <GestureRecognizer>recognizer);
      }
      GestureRegistry.addRecognizer(element, <GestureRecognizer>recognizer);
      attachedElement = element;
    },
    detach() {
      if (attachedElement) {
        GestureRegistry.removeRecognizer(attachedElement, <GestureRecognizer>recognizer);
        attachedElement = null;
      }
    },
  };
}
