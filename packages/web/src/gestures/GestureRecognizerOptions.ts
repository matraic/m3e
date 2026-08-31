import { GestureCallback } from "./GestureCallback";
import { GestureDetail } from "./GestureDetail";
import { GestureInputButton } from "./GestureInputButton";
import { GestureInputClaimantOptions } from "./GestureInputClaimantOptions";
import { PointerType } from "./PointerInput";

/**
 * Encapsulates options used to recognize gestures.
 * @template TDetail The type of detail emitted for a gesture.
 */
export interface GestureRecognizerOptions<
  TDetail extends GestureDetail = GestureDetail,
> extends GestureInputClaimantOptions {
  /**
   * Whether gesture recognition is disabled.
   * @default false
   */
  readonly disabled: boolean;

  /**
   * Which buttons can be pressed.
   * @default ["primary"]
   */
  readonly buttons: readonly GestureInputButton[];

  /**
   * Which types of pointers can be used to recognize gestures.
   * @default ["mouse", "pen", "touch"]
   */
  readonly pointerTypes: readonly PointerType[];

  /** Callback invoked when a gesture is recognized. */
  readonly onGesture?: GestureCallback<TDetail>;
}

/** Type used to infer the type of detail emitted for a gesture. */
export type GestureDetailOf<TOptions> = TOptions extends GestureRecognizerOptions<infer TDetail> ? TDetail : never;
