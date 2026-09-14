import { GestureListener } from "@m3e/web/gestures";

import { ScaleGestureDetail } from "./ScaleGestureDetail";
import { ScaleGestureOptions } from "./ScaleGestureOptions";
import { ScaleGestureRecognizer } from "./ScaleGestureRecognizer";

/**
 * Creates a recognizer used to detect and interpret scale gestures from incoming input streams.
 * @returns {ScaleGestureRecognizer} A recognizer that can be used to detect and interpret scale gestures.
 */
export function scale(): ScaleGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret scale gestures from incoming input streams.
 * @param {GestureListener<ScaleGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @returns {ScaleGestureRecognizer} A recognizer that can be used to detect and interpret scale gestures.
 */
export function scale(listener: GestureListener<ScaleGestureDetail>): ScaleGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret scale gestures from incoming input streams..
 * @param {Partial<ScaleGestureOptions>} options The options used to detect and interpret scale gestures.
 * @returns {ScaleGestureRecognizer} A recognizer that can be used to detect and interpret scale gestures.
 */
export function scale(options: Partial<ScaleGestureOptions>): ScaleGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret scale gestures from incoming input streams.
 * @param {GestureListener<ScaleGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<ScaleGestureOptions>} options The options used to detect and interpret scale gestures.
 * @returns {ScaleGestureRecognizer} A recognizer that can be used to detect and interpret scale gestures.
 */
export function scale(
  listener: GestureListener<ScaleGestureDetail>,
  options: Partial<ScaleGestureOptions>,
): ScaleGestureRecognizer;

/** @internal */
export function scale(
  listenerOrOptions?: GestureListener<ScaleGestureDetail> | Partial<ScaleGestureOptions>,
  maybeOptions?: Partial<ScaleGestureOptions>,
): ScaleGestureRecognizer {
  let listener: GestureListener<ScaleGestureDetail> | undefined;
  let options: Partial<ScaleGestureOptions> | undefined;

  if (typeof listenerOrOptions === "function") {
    listener = listenerOrOptions;
    options = maybeOptions;
  } else {
    options = listenerOrOptions;
  }

  return new ScaleGestureRecognizer(options, listener);
}
