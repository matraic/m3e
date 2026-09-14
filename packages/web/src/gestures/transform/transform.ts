import { GestureListener } from "@m3e/web/gestures";

import { TransformGestureDetail } from "./TransformGestureDetail";
import { TransformGestureOptions } from "./TransformGestureOptions";
import { TransformGestureRecognizer } from "./TransformGestureRecognizer";

/**
 * Creates a recognizer used to detect and interpret low-level transform gestures from incoming input streams.
 * @returns {TransformGestureRecognizer} A recognizer that can be used to detect and interpret low-level transform gestures.
 */
export function transform(): TransformGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret low-level transform gestures from incoming input streams.
 * @param {GestureListener<TransformGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @returns {TransformGestureRecognizer} A recognizer that can be used to detect and interpret low-level transform gestures.
 */
export function transform(listener: GestureListener<TransformGestureDetail>): TransformGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret low-level transform gestures from incoming input streams.
 * @param {Partial<TransformGestureOptions>} options The options used to detect and interpret low-level transform gestures.
 * @returns {TransformGestureRecognizer} A recognizer that can be used to detect and interpret low-level transform gestures.
 */
export function transform(options: Partial<TransformGestureOptions>): TransformGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret low-level transform gestures from incoming input streams.
 * @param {GestureListener<TransformGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<TransformGestureOptions>} options The options used to detect and interpret low-level transform gestures.
 * @returns {TransformGestureRecognizer} A recognizer that can be used to detect and interpret low-level transform gestures.
 */
export function transform(
  listener: GestureListener<TransformGestureDetail>,
  options: Partial<TransformGestureOptions>,
): TransformGestureRecognizer;

/** @internal */
export function transform(
  listenerOrOptions?: GestureListener<TransformGestureDetail> | Partial<TransformGestureOptions>,
  maybeOptions?: Partial<TransformGestureOptions>,
): TransformGestureRecognizer {
  let listener: GestureListener<TransformGestureDetail> | undefined;
  let options: Partial<TransformGestureOptions> | undefined;

  if (typeof listenerOrOptions === "function") {
    listener = listenerOrOptions;
    options = maybeOptions;
  } else {
    options = listenerOrOptions;
  }

  return new TransformGestureRecognizer(options, listener);
}
