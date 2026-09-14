import {
  GestureDetail,
  GestureListener,
  GestureOptions,
  GestureRecognizer,
  isGestureRecognizer,
} from "@m3e/web/gestures";

import { RepeatGestureDetail } from "./RepeatGestureDetail";
import { RepeatGestureOptions } from "./RepeatGestureOptions";
import { RepeatGestureRecognizer } from "./RepeatGestureRecognizer";

/**
 * Creates a recognizer used to detect and interpret repeated gestures from incoming input streams.
 * @template TDetail The type of semantic detail produced by each repeated occurrence.
 * @param {GestureRecognizer<GestureOptions, TDetail>} recognizer The recognizer used to detect the gesture to repeat.
 * @returns {RepeatGestureRecognizer<TDetail>} A recognizer that can be used to detect and interpret repeated gestures.
 */
export function repeat<TDetail extends GestureDetail>(
  recognizer: GestureRecognizer<GestureOptions, TDetail>,
): RepeatGestureRecognizer<TDetail>;

/**
 * Creates a recognizer used to detect and interpret repeated gestures from incoming input streams.
 * @template TDetail The type of semantic detail produced by each repeated occurrence.
 * @param {GestureListener<RepeatGestureDetail<TDetail>>} listener The function invoked when semantic detail is emitted.
 * @param {GestureRecognizer<GestureOptions, TDetail>} recognizer The recognizer used to detect the gesture to repeat.
 * @returns {RepeatGestureRecognizer<TDetail>} A recognizer that can be used to detect and interpret repeated gestures.
 */
export function repeat<TDetail extends GestureDetail>(
  listener: GestureListener<RepeatGestureDetail<TDetail>>,
  recognizer: GestureRecognizer<GestureOptions, TDetail>,
): RepeatGestureRecognizer<TDetail>;

/**
 * Creates a recognizer used to detect and interpret repeated gestures from incoming input streams.
 * @template TDetail The type of semantic detail produced by each repeated occurrence.
 * @param {Partial<RepeatGestureOptions>} options The options used to detect and interpret repeated gestures.
 * @param {GestureRecognizer<GestureOptions, TDetail>} recognizer The recognizer used to detect the gesture to repeat.
 * @returns {RepeatGestureRecognizer<TDetail>} A recognizer that can be used to detect and interpret repeated gestures.
 */
export function repeat<TDetail extends GestureDetail>(
  options: Partial<RepeatGestureOptions>,
  recognizer: GestureRecognizer<GestureOptions, TDetail>,
): RepeatGestureRecognizer<TDetail>;

/**
 * Creates a recognizer used to detect and interpret repeated gestures from incoming input streams.
 * @template TDetail The type of semantic detail produced by each repeated occurrence.
 * @param {GestureListener<RepeatGestureDetail<TDetail>>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<RepeatGestureOptions>} options The options used to detect and interpret repeated gestures.
 * @param {GestureRecognizer<GestureOptions, TDetail>} recognizer The recognizer used to detect the gesture to repeat.
 * @returns {RepeatGestureRecognizer<TDetail>} A recognizer that can be used to detect and interpret repeated gestures.
 */
export function repeat<TDetail extends GestureDetail>(
  listener: GestureListener<RepeatGestureDetail<TDetail>>,
  options: Partial<RepeatGestureOptions>,
  recognizer: GestureRecognizer<GestureOptions, TDetail>,
): RepeatGestureRecognizer<TDetail>;

/** @internal */
export function repeat<TDetail extends GestureDetail>(
  listenerOrOptionsOrRecognizer:
    | GestureListener<RepeatGestureDetail<TDetail>>
    | Partial<RepeatGestureOptions>
    | GestureRecognizer<GestureOptions, TDetail>,
  optionsOrRecognizer?: Partial<RepeatGestureOptions> | GestureRecognizer<GestureOptions, TDetail>,
  recognizerMaybe?: GestureRecognizer<GestureOptions, TDetail>,
): RepeatGestureRecognizer<TDetail> {
  let listener: GestureListener<RepeatGestureDetail<TDetail>> | undefined;
  let options: Partial<RepeatGestureOptions> | undefined;
  let recognizer: GestureRecognizer<GestureOptions, TDetail>;

  // repeat(recognizer)
  if (isGestureRecognizer(listenerOrOptionsOrRecognizer)) {
    recognizer = listenerOrOptionsOrRecognizer;
  }
  // repeat(listener, recognizer)
  else if (typeof listenerOrOptionsOrRecognizer === "function" && isGestureRecognizer(optionsOrRecognizer)) {
    listener = listenerOrOptionsOrRecognizer;
    recognizer = optionsOrRecognizer;
  }
  // repeat(options, recognizer)
  else if (typeof listenerOrOptionsOrRecognizer === "object" && isGestureRecognizer(optionsOrRecognizer)) {
    options = listenerOrOptionsOrRecognizer;
    recognizer = optionsOrRecognizer;
  }
  // repeat(listener, options, recognizer)
  else {
    listener = listenerOrOptionsOrRecognizer as GestureListener<RepeatGestureDetail<TDetail>>;
    options = optionsOrRecognizer as Partial<RepeatGestureOptions>;
    recognizer = recognizerMaybe!;
  }

  return new RepeatGestureRecognizer(options, listener, recognizer);
}
