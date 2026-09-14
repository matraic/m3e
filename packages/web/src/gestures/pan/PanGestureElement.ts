/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import {
  TransformGestureActivationMode,
  TransformGestureLockAxis,
  TransformGestureOptions,
} from "@m3e/web/gestures/transform";

import { PanGestureDetail } from "./PanGestureDetail";
import { PanGestureRecognizer } from "./PanGestureRecognizer";

/**
 * A non-visual element used to detect and interpret pan gestures from an input stream
 * produced from an attached element.
 *
 * @tag m3e-pan-gesture
 *
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr pointers - Number of pointers required for the gesture to be recognized.
 * @attr activation-mode - Mode in which to activate the gesture.
 * @attr min-displacement - Minimum distance (px) a pointer can move before the gesture starts.
 * @attr lock-axis - Locks movement to an axis.
 * @attr axis-threshold - Minimum total displacement (px) required before axis locking resolves.
 * @attr delta-threshold - Minimum incremental movement (px) on the secondary axis required before emitting detail for a locked axis.
 * @attr max-press-interval - Maximum allowed time (ms) between the earliest and latest press.
 *
 * @fires gesture - Emitted when semantic detail about a pan gesture is detected.
 */
@customElement("m3e-pan-gesture")
export class M3ePanGestureElement extends GestureElementBase<TransformGestureOptions, PanGestureDetail> {
  /** @inheritdoc */
  override readonly recognizer = new PanGestureRecognizer();

  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 1
   */
  @property({ type: Number, reflect: false }) pointers: number = this.recognizer.defaultOptions.pointers;

  /**
   * Mode in which to activate the gesture.
   * @default "press"
   */
  @property({ attribute: "activation-mode", useDefault: true, reflect: false })
  activationMode: TransformGestureActivationMode = this.recognizer.defaultOptions.activationMode;

  /**
   * Minimum distance (px) a pointer can move before the gesture starts.
   * @default 4
   */
  @property({ attribute: "min-displacement", type: Number, reflect: false }) minDisplacement: number =
    this.recognizer.defaultOptions.minDisplacement;

  /**
   * Locks movement to an axis.
   * @default "none"
   */
  @property({ attribute: "lock-axis", reflect: false }) lockAxis: TransformGestureLockAxis =
    this.recognizer.defaultOptions.lockAxis;

  /**
   * Minimum total displacement (px) required before axis locking resolves orientation.
   * @default 8
   */
  @property({ attribute: "axis-threshold", type: Number, reflect: false }) axisThreshold: number =
    this.recognizer.defaultOptions.axisThreshold;

  /**
   * Minimum incremental movement (px) on the secondary axis required before emitting detail for a locked axis.
   * @default 0
   */
  @property({ attribute: "delta-threshold", type: Number, reflect: false }) deltaThreshold: number =
    this.recognizer.defaultOptions.deltaThreshold;

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
      activationMode: this.activationMode,
      minDisplacement: this.minDisplacement,
      lockAxis: this.lockAxis,
      axisThreshold: this.axisThreshold,
      deltaThreshold: this.deltaThreshold,
      maxPressInterval: this.maxPressInterval,
    };
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
