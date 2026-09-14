import { GestureListener } from "@m3e/web/gestures";

import { RotateGestureDetail } from "./RotateGestureDetail";
import { RotateGestureOptions } from "./RotateGestureOptions";
import { RotateGestureRecognizer } from "./RotateGestureRecognizer";

/**
 * Creates a recognizer used to detect and interpret rotate gestures from incoming input streams.
 * @returns {RotateGestureRecognizer} A recognizer that can be used to detect and interpret rotate gestures.
 */
export function rotate(): RotateGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret rotate gestures from incoming input streams.
 * @param {GestureListener<RotateGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @returns {RotateGestureRecognizer} A recognizer that can be used to detect and interpret rotate gestures.
 */
export function rotate(listener: GestureListener<RotateGestureDetail>): RotateGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret rotate gestures from incoming input streams..
 * @param {Partial<RotateGestureOptions>} options The options used to detect and interpret rotate gestures.
 * @returns {RotateGestureRecognizer} A recognizer that can be used to detect and interpret rotate gestures.
 */
export function rotate(options: Partial<RotateGestureOptions>): RotateGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret rotate gestures from incoming input streams.
 * @param {GestureListener<RotateGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<RotateGestureOptions>} options The options used to detect and interpret rotate gestures.
 * @returns {RotateGestureRecognizer} A recognizer that can be used to detect and interpret rotate gestures.
 */
export function rotate(
  listener: GestureListener<RotateGestureDetail>,
  options: Partial<RotateGestureOptions>,
): RotateGestureRecognizer;

/** @internal */
export function rotate(
  listenerOrOptions?: GestureListener<RotateGestureDetail> | Partial<RotateGestureOptions>,
  maybeOptions?: Partial<RotateGestureOptions>,
): RotateGestureRecognizer {
  let listener: GestureListener<RotateGestureDetail> | undefined;
  let options: Partial<RotateGestureOptions> | undefined;

  if (typeof listenerOrOptions === "function") {
    listener = listenerOrOptions;
    options = maybeOptions;
  } else {
    options = listenerOrOptions;
  }

  return new RotateGestureRecognizer(options, listener);
}
