/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";

import { GestureElementBase } from "../core";
import { LongPressGestureDetail, LongPressGestureRecognizer } from "./LongPressGestureRecognizer";

/**
 * A non-visual element used to detect a long-press gesture for an associated element.
 * @tag m3e-long-press-gesture
 *
 * @example
 * The following example illustrates detecting long-press gestures on an element using `<m3e-long-press-gesture>`.
 * Use the `for` attribute to bind the gesture recognizer to a target element:
 *
 * ```html
 * <div id="div1"></div>
 * <m3e-long-press-gesture for="div1"></m3e-long-press-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle detected long-press gestures:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-long-press-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Total long-press duration
 *   console.log(detail.duration);
 * });
 * ```
 *
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr max-displacement - Maximum distance (px) a pointer can move before the gesture fails.
 * @attr min-duration - Minimum time (ms) a pointer must remain pressed.
 *
 * @fires gesture - Emitted when a long-press gesture is recognized.
 */
@customElement("m3e-long-press-gesture")
export class M3eLongPressGestureElement extends GestureElementBase<LongPressGestureDetail, LongPressGestureRecognizer> {
  /** @inheritdoc */
  override readonly recognizer = new LongPressGestureRecognizer();

  /**
   * Maximum distance (px) a pointer can move before the gesture fails.
   * @default 4
   */
  @property({ attribute: "max-displacement", type: Number }) maxDisplacement: number = 4;

  /**
   * Minimum time (ms) a pointer must remain pressed.
   * @default 500
   */
  @property({ attribute: "min-duration", type: Number }) minDuration: number = 500;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("maxDisplacement")) {
      this.recognizer.maxDisplacement = this.maxDisplacement;
    }
    if (_changedProperties.has("minDuration")) {
      this.recognizer.minDuration = this.minDuration;
    }
  }
}

interface M3eLongPressGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<LongPressGestureDetail>;
}

export interface M3eLongPressGestureElement {
  addEventListener<K extends keyof M3eLongPressGestureElementEventMap>(
    type: K,
    listener: (this: M3eLongPressGestureElement, ev: M3eLongPressGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eLongPressGestureElementEventMap>(
    type: K,
    listener: (this: M3eLongPressGestureElement, ev: M3eLongPressGestureElementEventMap[K]) => void,
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
    "m3e-long-press-gesture": M3eLongPressGestureElement;
  }
}
