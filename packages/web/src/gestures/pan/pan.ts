import { GestureListener } from "@m3e/web/gestures";

import { PanGestureDetail } from "./PanGestureDetail";
import { PanGestureOptions } from "./PanGestureOptions";
import { PanGestureRecognizer } from "./PanGestureRecognizer";

/**
 * Creates a recognizer used to detect and interpret pan gestures from incoming input streams.
 * @returns {PanGestureRecognizer} A recognizer that can be used to detect and interpret pan gestures.
 */
export function pan(): PanGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret pan gestures from incoming input streams.
 * @param {GestureListener<PanGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @returns {PanGestureRecognizer} A recognizer that can be used to detect and interpret pan gestures.
 */
export function pan(listener: GestureListener<PanGestureDetail>): PanGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret pan gestures from incoming input streams.
 * @param {Partial<PanGestureOptions>} options The options used to detect and interpret pan gestures.
 * @returns {PanGestureRecognizer} A recognizer that can be used to detect and interpret pan gestures.
 */
export function pan(options: Partial<PanGestureOptions>): PanGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret pan gestures from incoming input streams.
 * @param {GestureListener<PanGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<PanGestureOptions>} options The options used to detect and interpret pan gestures.
 * @returns {PanGestureRecognizer} A recognizer that can be used to detect and interpret pan gestures.
 */
export function pan(
  listener: GestureListener<PanGestureDetail>,
  options: Partial<PanGestureOptions>,
): PanGestureRecognizer;

/** @internal */
export function pan(
  listenerOrOptions?: GestureListener<PanGestureDetail> | Partial<PanGestureOptions>,
  maybeOptions?: Partial<PanGestureOptions>,
): PanGestureRecognizer {
  let listener: GestureListener<PanGestureDetail> | undefined;
  let options: Partial<PanGestureOptions> | undefined;

  if (typeof listenerOrOptions === "function") {
    listener = listenerOrOptions;
    options = maybeOptions;
  } else {
    options = listenerOrOptions;
  }

  return new PanGestureRecognizer(options, listener);
}
