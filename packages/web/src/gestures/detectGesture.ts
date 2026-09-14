import { GestureBinder } from "./GestureBinder";
import { GestureRecognizer } from "./GestureRecognizer";

/** Controls gesture detection for all recognizers bound through {@link detectGesture}. */
export interface GestureController {
  /** Whether gesture detection is currently disabled for all recognizers bound through this controller. */
  disabled: boolean;

  /** Stops detecting gestures by unbinding all recognizers previously bound through {@link detectGesture}. */
  destroy(): void;
}

/**
 * Starts detecting gestures on the specified element using one or more gesture recognizers.
 * @param {HTMLElement} element The element whose incoming input streams should be interpreted as gestures.
 * @param {...GestureRecognizer} recognizers One or more gesture recognizers used to detect and interpret gestures on the element.
 * @returns {GestureController} A controller used to disable, re-enable, or stop detecting gestures for all recognizers bound by this call.
 */
export function detectGesture(element: HTMLElement, ...recognizers: readonly GestureRecognizer[]): GestureController {
  GestureBinder.bind(element, ...recognizers);
  return {
    get disabled() {
      return recognizers.every((x) => x.disabled);
    },
    set disabled(value: boolean) {
      recognizers.forEach((x) => (x.disabled = value));
    },
    destroy() {
      GestureBinder.unbind(element, ...recognizers);
    },
  };
}
