/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement, spaceSeparatedStringConverter } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import {
  SwipeGestureDetail,
  SwipeGestureDirection,
  SwipeGestureOptions,
  SwipeGestureRecognizer,
} from "./SwipeGestureRecognizer";

/**
 * A non-visual element used to detect a swipe gesture for an associated element.
 *
 * @example
 * The following example illustrates detecting swipe gestures on an element using `<m3e-swipe-gesture>`.
 * Use the `for` attribute to bind the gesture recognizer to a target element:
 *
 * ```html
 * <div id="div1"></div>
 * <m3e-swipe-gesture for="div1"></m3e-swipe-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle detected swipe gestures:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-swipe-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Current direction
 *   console.log(detail.direction);
 * });
 * ```
 *
 * @tag m3e-swipe-gesture
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr max-displacement - * Maximum distance (px) a pointer can move before the gesture fails.
 * @attr min-velocity - Minimum velocity (px/ms) required to recognize a swipe.
 * @attr direction-threshold - Minimum displacement (px) required before direction is considered valid.
 * @attr directions - The allowed directions of the swipe.
 *
 * @fires gesture - Emitted when a swipe gesture is recognized.
 */
@customElement("m3e-swipe-gesture")
export class M3eSwipeGestureElement extends GestureElementBase<SwipeGestureOptions> {
  constructor() {
    super(SwipeGestureRecognizer.gestureType);
  }

  /**
   * * Maximum distance (px) a pointer can move before the gesture fails.
   * @default 24
   */
  @property({ attribute: "max-displacement", type: Number }) maxDisplacement: number = 24;

  /**
   * Minimum velocity (px/ms) required before the gesture fails.
   * @default 0.3
   */
  @property({ attribute: "min-velocity", type: Number }) minVelocity = 0.3;

  /**
   * Minimum displacement (px) required before direction is considered valid.
   * @default 8
   */
  @property({ attribute: "direction-threshold", type: Number }) directionThreshold = 8;

  /**
   * The allowed directions of the swipe.
   * @default ["left", "right", "up", "down"]
   */
  @property({ converter: spaceSeparatedStringConverter })
  directions: readonly SwipeGestureDirection[] = ["left", "right", "up", "down"];

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("maxDisplacement")) {
      this.recognizer?.updateOptions({ maxDisplacement: this.maxDisplacement });
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

interface M3eSwipeGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<SwipeGestureDetail>;
}

export interface M3eSwipeGestureElement {
  addEventListener<K extends keyof M3eSwipeGestureElementEventMap>(
    type: K,
    listener: (this: M3eSwipeGestureElement, ev: M3eSwipeGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eSwipeGestureElementEventMap>(
    type: K,
    listener: (this: M3eSwipeGestureElement, ev: M3eSwipeGestureElementEventMap[K]) => void,
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
    "m3e-swipe-gesture": M3eSwipeGestureElement;
  }
}
