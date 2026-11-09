/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { ScaleGestureDetail } from "./ScaleGestureDetail";
import { ScaleGestureOptions } from "./ScaleGestureOptions";
import { ScaleGestureRecognizer } from "./ScaleGestureRecognizer";

/**
 * A non-visual element used to detect and interpret scale gestures from an input stream
 * produced from an attached element.
 *
 * @example
 * Detect scale declaratively by importing `@m3e/web/gestures/scale` and binding the gesture element to the target with `for`. Listen for its `gesture` event. Give the target a visible size and an appropriate `touch-action` (the showcase uses `touch-action: none`); provide an accessible alternative for gesture-only interactions.
 *
 * ```html
 * <div id="item"></div>
 * <m3e-scale-gesture for="item"></m3e-scale-gesture>
 * ```
 *
 * @example
 * Alternatively, use the same target with `detectGesture` and `phase`. Replace the handler placeholders and retain the returned controller to call `destroy()` when no longer needed. The showcase's rotate comments are placeholders for scale handling.
 *
 * ```js
 * import { detectGesture, phase } from "@m3e/web/gestures";
 * import { scale } from "@m3e/web/gestures/scale";
 *
 * const item = document.getElementById("item");
 * detectGesture(item, scale(phase({
 *   onStart: (detail) => {
 *     // Begin tracking
 *   },
 *   onUpdate: (detail) => {
 *     // Continuous movement
 *   },
 *   onEnd: (detail) => {
 *     // Finalize rotate
 *   },
 *   onCancel: (detail) => {
 *     // Abort rotate
 *   }
 * })));
 * ```
 *
 * @tag m3e-scale-gesture
 *
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr pointers - Number of pointers required for the gesture to be recognized.
 * @attr min-displacement - Minimum distance (px) a pointer must move before the gesture starts.
 * @attr max-press-interval - Maximum allowed time (ms) between the earliest and latest press.
 *
 * @fires gesture - Emitted when semantic detail about a gesture is detected.
 */
@customElement("m3e-scale-gesture")
export class M3eScaleGestureElement extends GestureElementBase<ScaleGestureOptions, ScaleGestureDetail> {
  /** @inheritdoc */
  override readonly recognizer = new ScaleGestureRecognizer();

  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 2
   */
  @property({ type: Number, reflect: false }) pointers: number = this.recognizer.defaultOptions.pointers;

  /**
   * Minimum distance (px) a pointer must move before the gesture starts.
   * @default 4
   */
  @property({ attribute: "min-displacement", type: Number, reflect: false }) minDisplacement: number =
    this.recognizer.defaultOptions.minDisplacement;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  @property({ attribute: "max-press-interval", type: Number, reflect: false }) maxPressInterval: number =
    this.recognizer.defaultOptions.maxPressInterval;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);
    this.recognizer.options = {
      pointers: this.pointers,
      minDisplacement: this.minDisplacement,
      maxPressInterval: this.maxPressInterval,
    };
  }
}

interface M3eScaleGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<ScaleGestureDetail>;
}

export interface M3eScaleGestureElement {
  addEventListener<K extends keyof M3eScaleGestureElementEventMap>(
    type: K,
    listener: (this: M3eScaleGestureElement, ev: M3eScaleGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eScaleGestureElementEventMap>(
    type: K,
    listener: (this: M3eScaleGestureElement, ev: M3eScaleGestureElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-scale-gesture": M3eScaleGestureElement;
  }
}
