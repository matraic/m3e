import { GestureListener, GestureRecognizer, isGestureRecognizer } from "@m3e/web/gestures";

import { SequenceGestureRecognizer } from "./SequenceGestureRecognizer";
import { SequenceGestureDetail } from "./SequenceGestureDetail";
import { SequenceGestureOptions } from "./SequenceGestureOptions";

/**
 * Creates a recognizer used to detect and interpret a sequence of gestures from incoming input streams.
 * @param {readonly GestureRecognizer[]} recognizers The recognizers used to detect a sequence of gestures.
 * @returns {SequenceGestureRecognizer} A recognizer that can be used to detect and interpret a sequence of gestures.
 */
export function sequence(...recognizers: readonly GestureRecognizer[]): SequenceGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret a sequence of gestures from incoming input streams.
 * @param {GestureListener<SequenceGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {readonly GestureRecognizer[]} recognizers The recognizers used to detect a sequence of gestures.
 * @returns {SequenceGestureRecognizer} A recognizer that can be used to detect and interpret a sequence of gestures.
 */
export function sequence(
  listener: GestureListener<SequenceGestureDetail>,
  ...recognizers: readonly GestureRecognizer[]
): SequenceGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret a sequence of gestures from incoming input streams.
 * @param {Partial<SequenceGestureOptions>} options The options used to detect and interpret a sequence of gestures.
 * @param {readonly GestureRecognizer[]} recognizers The recognizers used to detect a sequence of gestures.
 * @returns {SequenceGestureRecognizer} A recognizer that can be used to detect and interpret a sequence of gestures.
 */
export function sequence(
  options: Partial<SequenceGestureOptions>,
  ...recognizers: readonly GestureRecognizer[]
): SequenceGestureRecognizer;

/**
 * Creates a recognizer used to detect and interpret a sequence of gestures from incoming input streams.
 * @param {GestureListener<SequenceGestureDetail>} listener The function invoked when semantic detail is emitted.
 * @param {Partial<SequenceGestureOptions>} options The options used to detect and interpret a sequence of gestures.
 * @param {readonly GestureRecognizer[]} recognizers The recognizers used to detect a sequence of gestures.
 * @returns {SequenceGestureRecognizer} A recognizer that can be used to detect and interpret a sequence of gestures.
 */
export function sequence(
  listener: GestureListener<SequenceGestureDetail>,
  options: Partial<SequenceGestureOptions>,
  ...recognizers: readonly GestureRecognizer[]
): SequenceGestureRecognizer;

/** @internal */
export function sequence(...args: unknown[]): SequenceGestureRecognizer {
  let listener: GestureListener<SequenceGestureDetail> | undefined;
  let options: Partial<SequenceGestureOptions> | undefined;
  let index = 0;

  if (typeof args[0] === "function") {
    listener = args[0] as GestureListener<SequenceGestureDetail>;
    index++;
  }

  if (args[index] !== undefined && typeof args[index] === "object" && !isGestureRecognizer(args[index])) {
    options = args[index] as Partial<SequenceGestureOptions>;
    index++;
  }

  const recognizers = args.slice(index) as readonly GestureRecognizer[];
  return new SequenceGestureRecognizer(options, listener, ...recognizers);
}
