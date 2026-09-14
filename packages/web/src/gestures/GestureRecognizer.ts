import { hasKeys } from "@m3e/web/core";

import { GestureDetail } from "./GestureDetail";
import { GestureInput, PointerInput } from "./GestureInput";
import { GestureOptions } from "./GestureOptions";

/**
 * Specifies the possible dispositions of a gesture during recognition.
 * - `accept` — The recognizer intends to claim a gesture.
 * - `reject` — The recognizer declines or withdraws.
 * - `hold` — The recognizer delays its decision, waiting for more input.
 * - `release` — The recognizer releases a previously held decision.
 * - `defer` — The recognizer remains active without blocking resolution and will be rejected unless it later accepts.
 */
export type GestureDisposition = "accept" | "reject" | "hold" | "release" | "defer";

/**
 * Function invoked when a recognizer reports a disposition for an input stream.
 * @param {number} inputId The identifier of the input stream whose disposition is being reported.
 * @param {GestureDisposition} disposition The recognizer's disposition for the input stream.
 */
export type GestureDispositionCallback = (inputId: number, disposition: GestureDisposition) => void;

/**
 * Specifies the possible resolutions for dispositions made for a gesture.
 * - `accept` — The gesture has been accepted.
 * - `reject` — The gesture has been rejected.
 */
export type GestureResolution = "accept" | "reject";

/**
 * Function invoked when detail about a gesture is recognized.
 * @template TDetail The type of semantic detail emitted for a gesture.
 * @param {TDetail} detail The semantic detail emitted for a gesture.
 */
export type GestureListener<TDetail extends GestureDetail = GestureDetail> = (detail: TDetail) => void;

/**
 * Defines functionality required to detect and interpret gestures from incoming input streams.
 * @template TOptions The type of options used to detect and interpret gestures.
 * @template TDetail The type of semantic detail emitted for a gesture.
 */
export interface GestureRecognizer<
  TOptions extends GestureOptions = GestureOptions,
  TDetail extends GestureDetail = GestureDetail,
> {
  /** The options used to detect and interpret gestures. */
  get options(): TOptions;
  set options(value: Partial<TOptions>);

  /** Whether gesture recognition is disabled. */
  disabled: boolean;

  /** Whether dispositions for claims on input streams should be eagerly accepted. */
  readonly eager: boolean;

  /**
   * Determines whether the specified input can be received.
   * @param {GestureInput} input The input to test.
   */
  canReceiveInput(input: GestureInput): boolean;
  /**
   * Determines whether the pointer should be captured for the specified input.
   * @param {PointerInput} input The input to test.
   */
  shouldCapturePointer(input: PointerInput): boolean;

  /**
   * Receives an input sample from which to detect a gesture.
   * @param input The input sample to receive.
   */
  onInput(input: GestureInput): void;

  /** Reports a disposition decision for an input stream. */
  onDisposition?: GestureDispositionCallback;

  /**
   * Reports the final resolution for the specified input stream.
   * @param {number} inputId The identifier of the input stream being resolved.
   * @param {GestureResolution} resolution The final resolution for that input.
   */
  onResolution(inputId: number, resolution: GestureResolution): void;

  /**
   * Registers a function that will be invoked when detail about a gesture is emitted.
   * @param {GestureListener<TDetail>} listener The gesture listener invoked when detail about a gesture is emitted.
   */
  addListener(listener: GestureListener<TDetail>): void;

  /**
   * Removes a previously registered gesture listener.
   * @param {GestureListener<TDetail>} listener The gesture listener function tom remove.
   */
  removeListener(listener: GestureListener<TDetail>): void;

  /** Resets the recognizer to its initial state. */
  reset(): void;
}

/**
 * Determines whether a value is a {@link GestureRecognizer}.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a {@link GestureRecognizer}.
 */
export function isGestureRecognizer(value: unknown): value is GestureRecognizer {
  return hasKeys<GestureRecognizer>(
    value,
    "addListener",
    "canReceiveInput",
    "disabled",
    "eager",
    "onInput",
    "onResolution",
    "options",
    "removeListener",
    "reset",
    "shouldCapturePointer",
  );
}
