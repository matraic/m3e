/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";

import { GestureElementBase } from "../core";
import { PanGestureDetail, PanGestureLockAxis, PanGestureRecognizer } from "./PanGestureRecognizer";

/**
 * A non-visual element used to detect a pan gesture for an associated element.
 *
 * @example
 * The following example illustrates detecting pan gestures on an element using `<m3e-pan-gesture>`.
 * Use the `for` attribute to bind the gesture recognizer to a target element:
 *
 * ```html
 * <div id="div1"></div>
 * <m3e-pan-gesture for="div1"></m3e-pan-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle detected pan gestures:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-pan-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Current phase (start, move, end, cancel)
 *   console.log(detail.phase);
 *
 *   // Total displacement along the primary axis
 *   console.log(detail.totalPrimaryDelta);
 *
 *   // Current incremental movement
 *   console.log(detail.deltaX, detail.deltaY);
 *
 *   // Current velocity
 *   console.log(detail.velocityX, detail.velocityY);
 * });
 * ```
 *
 * @tag m3e-pan-gesture
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr min-displacement - Minimum distance (px) a pointer can move before the gesture starts.
 * @attr min-duration - Minimum time (ms) a pointer must remain pressed.
 * @attr lock-axis - Locks movement to an axis.
 * @attr axis-threshold - Minimum total displacement (px) required before axis locking resolves.
 * @attr delta-threshold - Minimum incremental movement (px) on the secondary axis required before emitting move updates.
 *
 * @fires gesture - Emitted when a pan gesture is recognized.
 */
@customElement("m3e-pan-gesture")
export class M3ePanGestureElement extends GestureElementBase<PanGestureDetail, PanGestureRecognizer> {
  /** @inheritdoc */
  override readonly recognizer = new PanGestureRecognizer();

  /**
   * Minimum distance (px) a pointer can move before the gesture starts.
   * @default 4
   */
  @property({ attribute: "min-displacement", type: Number }) minDisplacement: number = 4;

  /**
   * Locks movement to an axis.
   * @default "none"
   */
  @property({ attribute: "lock-axis" }) lockAxis: PanGestureLockAxis = "none";

  /**
   * Minimum total displacement (px) required before axis locking resolves orientation.
   * @default 8
   */
  @property({ attribute: "axis-threshold", type: Number }) axisThreshold: number = 8;

  /**
   * Minimum incremental movement (px) on the secondary axis required before emitting move updates.
   * @default 0
   */
  @property({ attribute: "delta-threshold", type: Number }) deltaThreshold: number = 0;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("minDisplacement")) {
      this.recognizer.minDisplacement = this.minDisplacement;
    }
    if (_changedProperties.has("lockAxis")) {
      this.recognizer.lockAxis = this.lockAxis;
    }
    if (_changedProperties.has("axisThreshold")) {
      this.recognizer.axisThreshold = this.axisThreshold;
    }
    if (_changedProperties.has("deltaThreshold")) {
      this.recognizer.deltaThreshold = this.deltaThreshold;
    }
  }
}

interface M3ePanGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<PanGestureDetail>;
}

export interface M3ePanGestureElement {
  addEventListener<K extends keyof M3ePanGestureElementEventMap>(
    type: K,
    listener: (this: M3ePanGestureElement, ev: M3ePanGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3ePanGestureElementEventMap>(
    type: K,
    listener: (this: M3ePanGestureElement, ev: M3ePanGestureElementEventMap[K]) => void,
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
    "m3e-pan-gesture": M3ePanGestureElement;
  }
}
