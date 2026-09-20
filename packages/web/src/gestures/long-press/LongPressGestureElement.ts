/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { LongPressGestureDetail } from "./LongPressGestureDetail";
import { LongPressGestureOptions } from "./LongPressGestureOptions";
import { LongPressGestureRecognizer } from "./LongPressGestureRecognizer";

/**
 * A non-visual element used to detect and interpret long-press gestures from an input stream
 * produced from an attached element.
 *
 * @tag m3e-long-press-gesture
 *
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr discrete - Whether the gesture is discrete.
 * @attr pointers - Number of pointers required for the gesture to be recognized.
 * @attr max-displacement - Maximum allowed movement (px).
 * @attr min-duration - Minimum time (ms) a pointer must remain pressed.
 * @attr max-press-interval - Maximum allowed time (ms) between the earliest and latest press.
 *
 * @fires gesture - Emitted when semantic detail about a gesture is detected.
 */
@customElement("m3e-long-press-gesture")
export class M3eLongPressGestureElement extends GestureElementBase<LongPressGestureOptions, LongPressGestureDetail> {
  /** @inheritdoc */
  override readonly recognizer = new LongPressGestureRecognizer();

  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 1
   */
  @property({ type: Number, reflect: false }) pointers: number = this.recognizer.defaultOptions.pointers;

  /**
   * Minimum time (ms) a pointer must remain pressed.
   * @default 500
   */
  @property({ attribute: "min-duration", type: Number, reflect: false }) minDuration: number =
    this.recognizer.defaultOptions.minDuration;

  /**
   * Maximum allowed movement (px).
   * @default 4
   */
  @property({ attribute: "max-displacement", type: Number, reflect: false }) maxDisplacement: number =
    this.recognizer.defaultOptions.maxDisplacement;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  @property({ attribute: "max-press-interval", type: Number, reflect: false }) maxPressInterval: number =
    this.recognizer.defaultOptions.maxPressInterval;

  /**
   * Whether the gesture is discrete. If `true`, starts after `minDuration`
   * while pointers stay down and ends on pointer-up. If `false`, starts
   * immediately when pointers are down and ends after `minDuration`.
   * @default false
   */
  @property({ type: Boolean, reflect: false }) discrete: boolean = false;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);
    this.recognizer.options = {
      pointers: this.pointers,
      minDuration: this.minDuration,
      maxDisplacement: this.maxDisplacement,
      maxPressInterval: this.maxPressInterval,
      discrete: this.discrete,
    };
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
