/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { ScaleGestureDetail, ScaleGestureRecognizer } from "./ScaleGestureRecognizer";

/**
 * A non-visual element used to detect a scale gesture for an associated element.
 *
 * @example
 * The following example illustrates detecting scale gestures on an element using `<m3e-scale-gesture>`.
 * Use the `for` attribute to bind the gesture recognizer to a target element:
 *
 * ```html
 * <div id="div1"></div>
 * <m3e-scale-gesture for="div1"></m3e-scale-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle detected scale gestures:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-scale-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Current phase (start, move, end, cancel)
 *   console.log(detail.phase);
 *
 *   // Scale factor relative to the initial pointer distance.
 *   // A value of 1 represents no scaling; values >1 indicate expansion,
 *   // and values <1 indicate contraction.
 *   console.log(detail.scale);
 * });
 * ```
 *
 * @tag m3e-scale-gesture
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr pointers - Number of pointers that must be pressed before the gesture fails.
 * @attr distance-threshold - Minimum distance change (px) required to activate scale.
 *
 * @fires gesture - Emitted when a scale gesture is recognized.
 */
@customElement("m3e-scale-gesture")
export class M3eScaleGestureElement extends GestureElementBase<ScaleGestureDetail, ScaleGestureRecognizer> {
  /** @inheritdoc */
  override readonly recognizer = new ScaleGestureRecognizer();

  /**
   * Number of pointers that must be pressed before the gesture fails.
   * @default 2
   */
  @property({ type: Number }) pointers: number = 2;

  /**
   * Minimum distance change (px) required to activate scale.
   * @default 4
   */
  @property({ attribute: "distance-threshold", type: Number }) distanceThreshold = 4;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("pointers")) {
      this.recognizer.pointers = this.pointers;
    }
    if (_changedProperties.has("distanceThreshold")) {
      this.recognizer.distanceThreshold = this.distanceThreshold;
    }
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
