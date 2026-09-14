import { GestureListener } from "@m3e/web/gestures";

import { SwipeGestureDetail } from "./SwipeGestureDetail";
import { SwipeGestureOptions } from "./SwipeGestureOptions";
import { SwipeGestureRecognizer } from "./SwipeGestureRecognizer";

/**
 * Creates a recognizer used to detect and interpret swipe gestures from incoming input streams.
 * @returns {SwipeGestureRecognizer} A recognizer that can be used to detect and interpret swipe gestures.
 */
export function swipe(): SwipeGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret swipe gestures from incoming input streams.
 * @param {GestureListener<SwipeGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @returns {SwipeGestureRecognizer} A recognizer that can be used to detect and interpret swipe gestures.
 */
export function swipe(listener: GestureListener<SwipeGestureDetail>): SwipeGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret swipe gestures from incoming input streams..
 * @param {Partial<SwipeGestureOptions>} options The options used to detect and interpret swipe gestures.
 * @returns {SwipeGestureRecognizer} A recognizer that can be used to detect and interpret swipe gestures.
 */
export function swipe(options: Partial<SwipeGestureOptions>): SwipeGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret swipe gestures from incoming input streams.
 * @param {GestureListener<SwipeGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<SwipeGestureOptions>} options The options used to detect and interpret swipe gestures.
 * @returns {SwipeGestureRecognizer} A recognizer that can be used to detect and interpret swipe gestures.
 */
export function swipe(
  listener: GestureListener<SwipeGestureDetail>,
  options: Partial<SwipeGestureOptions>,
): SwipeGestureRecognizer;

/** @internal */
export function swipe(
  listenerOrOptions?: GestureListener<SwipeGestureDetail> | Partial<SwipeGestureOptions>,
  maybeOptions?: Partial<SwipeGestureOptions>,
): SwipeGestureRecognizer {
  let listener: GestureListener<SwipeGestureDetail> | undefined;
  let options: Partial<SwipeGestureOptions> | undefined;

  if (typeof listenerOrOptions === "function") {
    listener = listenerOrOptions;
    options = maybeOptions;
  } else {
    options = listenerOrOptions;
  }

  return new SwipeGestureRecognizer(options, listener);
}
