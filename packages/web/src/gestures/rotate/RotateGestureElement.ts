/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";
import { PanGestureActivationMode } from "@m3e/web/gestures/pan";

import { RotateGestureDetail } from "./RotateGestureDetail";
import { RotateGestureOptions } from "./RotateGestureOptions";
import { RotateGestureRecognizer } from "./RotateGestureRecognizer";

/**
 * A non-visual element used to detect and interpret rotate gestures from an input stream
 * produced from an attached element.
 *
 * @tag m3e-rotate-gesture
 *
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr activation-mode - Mode in which to activate the gesture.
 * @attr pointers - Number of pointers required for the gesture to be recognized.
 * @attr min-displacement - Minimum centroid displacement (px) before rotation starts.
 * @attr max-press-interval - Maximum allowed time (ms) between the earliest and latest press.
 *
 * @fires gesture - Emitted when semantic detail about a gesture is detected.
 */
@customElement("m3e-rotate-gesture")
export class M3eRotateGestureElement extends GestureElementBase<RotateGestureOptions, RotateGestureDetail> {
  /** @inheritdoc */
  override readonly recognizer = new RotateGestureRecognizer();

  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 2
   */
  @property({ type: Number, reflect: false }) pointers: number = this.recognizer.defaultOptions.pointers;

  /**
   * Mode in which to activate the gesture.
   * @default "press"
   */
  @property({ attribute: "activation-mode", useDefault: true, reflect: false })
  activationMode: PanGestureActivationMode = this.recognizer.defaultOptions.activationMode;

  /**
   * Minimum centroid displacement (px) before rotation starts.
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
      activationMode: this.activationMode,
      pointers: this.pointers,
      minDisplacement: this.minDisplacement,
      maxPressInterval: this.maxPressInterval,
    };
  }
}

interface M3eRotateGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<RotateGestureDetail>;
}

export interface M3eRotateGestureElement {
  addEventListener<K extends keyof M3eRotateGestureElementEventMap>(
    type: K,
    listener: (this: M3eRotateGestureElement, ev: M3eRotateGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eRotateGestureElementEventMap>(
    type: K,
    listener: (this: M3eRotateGestureElement, ev: M3eRotateGestureElementEventMap[K]) => void,
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
    "m3e-rotate-gesture": M3eRotateGestureElement;
  }
}
