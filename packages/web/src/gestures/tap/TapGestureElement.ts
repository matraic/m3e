/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { TapGestureDetail, TapGestureOptions, TapGestureRecognizer } from "./TapGestureRecognizer";

/**
 * A non-visual element used to detect a tap gesture for an associated element.
 * @tag m3e-tap-gesture
 *
 * @example
 * The following example illustrates detecting tap gestures on an element using `<m3e-tap-gesture>`.
 * Use the `for` attribute to bind the gesture recognizer to a target element:
 *
 * ```html
 * <div id="div1"></div>
 * <m3e-tap-gesture for="div1"></m3e-tap-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle detected tap gestures:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-tap-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Number of pointers (fingers) involved in the tap
 *   console.log(detail.pointers.length);
 *
 *   // Coordinates of the first pointer (finger)
 *   console.log(detail.pointers[0].clientX, detail.pointers[0].clientY);
 *
 *   // Total tap duration
 *   console.log(detail.duration);
 * });
 * ```
 *
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr pointers - Number of pointers that must be pressed before the gesture fails.
 * @attr max-press-interval - Maximum time (ms) between tap presses.
 * @attr max-release-interval - Maximum time (ms) between tap releases.
 * @attr max-displacement - Maximum distance (px) a pointer can move before the gesture fails.
 * @attr max-duration - Maximum time (ms) taps can be pressed before the gesture fails.
 *
 * @fires gesture - Emitted when a tap gesture is recognized.
 */
@customElement("m3e-tap-gesture")
export class M3eTapGestureElement extends GestureElementBase<TapGestureOptions> {
  constructor() {
    super(TapGestureRecognizer.gestureType);
  }

  /**
   * Number of pointers that must be pressed before the gesture fails.
   * @default 1
   */
  @property({ type: Number }) pointers: number = 1;

  /**
   * Maximum time (ms) between tap presses.
   * @default 120
   */
  @property({ attribute: "max-press-interval", type: Number }) maxPressInterval = 120;

  /**
   * Maximum time (ms) between tap releases.
   * @default 120
   */
  @property({ attribute: "max-release-interval", type: Number }) maxReleaseInterval = 120;

  /**
   * Maximum time (ms) taps can be pressed before the gesture fails.
   * @default 180
   */
  @property({ attribute: "max-duration", type: Number }) maxDuration = 180;

  /**
   * Maximum distance (px) a pointer can move before the gesture fails.
   * @default 12
   */
  @property({ attribute: "max-displacement", type: Number }) maxDisplacement = 12;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("pointers")) {
      this.recognizer?.updateOptions({ pointers: this.pointers });
    }
    if (_changedProperties.has("maxPressInterval")) {
      this.recognizer?.updateOptions({ maxPressInterval: this.maxPressInterval });
    }
    if (_changedProperties.has("maxReleaseInterval")) {
      this.recognizer?.updateOptions({ maxReleaseInterval: this.maxReleaseInterval });
    }
    if (_changedProperties.has("maxDisplacement")) {
      this.recognizer?.updateOptions({ maxDisplacement: this.maxDisplacement });
    }
    if (_changedProperties.has("maxDuration")) {
      this.recognizer?.updateOptions({ maxDuration: this.maxDuration });
    }
  }
}

interface M3eTapGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<TapGestureDetail>;
}

export interface M3eTapGestureElement {
  addEventListener<K extends keyof M3eTapGestureElementEventMap>(
    type: K,
    listener: (this: M3eTapGestureElement, ev: M3eTapGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eTapGestureElementEventMap>(
    type: K,
    listener: (this: M3eTapGestureElement, ev: M3eTapGestureElementEventMap[K]) => void,
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
    "m3e-tap-gesture": M3eTapGestureElement;
  }
}
