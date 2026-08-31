/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement, spaceSeparatedStringConverter } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { FlingGestureDetail, FlingGestureDirection, FlingGestureOptions } from "./FlingGestureRecognizer";

/**
 * A non-visual element used to detect a fling gesture for an associated element.
 *
 * @example
 * The following example illustrates detecting fling gestures on an element using `<m3e-fling-gesture>`.
 * Use the `for` attribute to bind the gesture recognizer to a target element:
 *
 * ```html
 * <div id="div1"></div>
 * <m3e-fling-gesture for="div1"></m3e-fling-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle detected fling gestures:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-fling-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Current direction
 *   console.log(detail.direction);
 * });
 * ```
 *
 * @tag m3e-fling-gesture
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr min-displacement - * Minimum distance (px) a pointer must move before the gesture can be recognized.
 * @attr min-velocity - Minimum velocity (px/ms) required to recognize a fling.
 * @attr direction-threshold - Minimum displacement (px) required before direction is considered valid.
 * @attr directions - The allowed directions of the fling.
 *
 * @fires gesture - Emitted when a fling gesture is recognized.
 */
@customElement("m3e-fling-gesture")
export class M3eFlingGestureElement extends GestureElementBase<FlingGestureOptions> {
  /** @inheritdoc */
  override gestureType: string = "fling";

  /**
   * * Minimum distance (px) a pointer must move before the gesture can be recognized.
   * @default 12
   */
  @property({ attribute: "min-displacement", type: Number }) minDisplacement: number = 12;

  /**
   * Minimum velocity (px/ms) required before the gesture fails.
   * @default 0.3
   */
  @property({ attribute: "min-velocity", type: Number }) minVelocity = 0.3;

  /**
   * Minimum displacement (px) required before direction is considered valid.
   * @default 12
   */
  @property({ attribute: "direction-threshold", type: Number }) directionThreshold = 12;

  /**
   * The allowed directions of the fling.
   * @default ["left", "right", "up", "down"]
   */
  @property({ converter: spaceSeparatedStringConverter })
  directions: readonly FlingGestureDirection[] = ["left", "right", "up", "down"];

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("minDisplacement")) {
      this.recognizer?.updateOptions({ minDisplacement: this.minDisplacement });
    }
    if (_changedProperties.has("minVelocity")) {
      this.recognizer?.updateOptions({ minVelocity: this.minVelocity });
    }
    if (_changedProperties.has("directionThreshold")) {
      this.recognizer?.updateOptions({ directionThreshold: this.directionThreshold });
    }
    if (_changedProperties.has("directions")) {
      this.recognizer?.updateOptions({ directions: this.directions });
    }
  }
}

interface M3eFlingGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<FlingGestureDetail>;
}

export interface M3eFlingGestureElement {
  addEventListener<K extends keyof M3eFlingGestureElementEventMap>(
    type: K,
    listener: (this: M3eFlingGestureElement, ev: M3eFlingGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eFlingGestureElementEventMap>(
    type: K,
    listener: (this: M3eFlingGestureElement, ev: M3eFlingGestureElementEventMap[K]) => void,
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
    "m3e-fling-gesture": M3eFlingGestureElement;
  }
}
