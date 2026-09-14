import { GestureListener } from "@m3e/web/gestures";

import { TapGestureDetail } from "./TapGestureDetail";
import { TapGestureOptions } from "./TapGestureOptions";
import { TapGestureRecognizer } from "./TapGestureRecognizer";

/**
 * Creates a recognizer used to detect and interpret tap gestures from incoming input streams.
 * @returns {TapGestureRecognizer} A recognizer that can be used to detect and interpret tap gestures.
 */
export function tap(): TapGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret tap gestures from incoming input streams.
 * @param {GestureListener<TapGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @returns {TapGestureRecognizer} A recognizer that can be used to detect and interpret tap gestures.
 */
export function tap(listener: GestureListener<TapGestureDetail>): TapGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret tap gestures from incoming input streams..
 * @param {Partial<TapGestureOptions>} options The options used to detect and interpret tap gestures.
 * @returns {TapGestureRecognizer} A recognizer that can be used to detect and interpret tap gestures.
 */
export function tap(options: Partial<TapGestureOptions>): TapGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret tap gestures from incoming input streams.
 * @param {GestureListener<TapGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<TapGestureOptions>} options The options used to detect and interpret tap gestures.
 * @returns {TapGestureRecognizer} A recognizer that can be used to detect and interpret tap gestures.
 */
export function tap(
  listener: GestureListener<TapGestureDetail>,
  options: Partial<TapGestureOptions>,
): TapGestureRecognizer;

/** @internal */
export function tap(
  listenerOrOptions?: GestureListener<TapGestureDetail> | Partial<TapGestureOptions>,
  maybeOptions?: Partial<TapGestureOptions>,
): TapGestureRecognizer {
  let listener: GestureListener<TapGestureDetail> | undefined;
  let options: Partial<TapGestureOptions> | undefined;

  if (typeof listenerOrOptions === "function") {
    listener = listenerOrOptions;
    options = maybeOptions;
  } else {
    options = listenerOrOptions;
  }

  return new TapGestureRecognizer(options, listener);
}
