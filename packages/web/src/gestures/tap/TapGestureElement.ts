/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { TapGestureDetail } from "./TapGestureDetail";
import { TapGestureOptions } from "./TapGestureOptions";
import { TapGestureRecognizer } from "./TapGestureRecognizer";

/**
 * A non-visual element used to detect and interpret tap gestures from an input stream
 * produced from an attached element.
 *
 * @tag m3e-tap-gesture
 *
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr pointers - Number of pointers required for the gesture to be recognized.
 * @attr max-displacement - Maximum allowed movement (px).
 * @attr max-duration - Maximum allowed press duration (ms).
 * @attr max-press-interval - Maximum allowed time (ms) between the earliest and latest press.
 * @attr max-release-interval - Maximum allowed time (ms) between the earliest and latest release.
 *
 * @fires gesture - Emitted when semantic detail about a gesture is detected.
 */
@customElement("m3e-tap-gesture")
export class M3eTapGestureElement extends GestureElementBase<TapGestureOptions, TapGestureDetail> {
  /** @inheritdoc */
  override readonly recognizer = new TapGestureRecognizer();

  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 1
   */
  @property({ type: Number, reflect: false }) pointers: number = this.recognizer.defaultOptions.pointers;

  /**
   * Maximum allowed press duration (ms).
   * @default 180
   */
  @property({ attribute: "max-duration", type: Number, reflect: false }) maxDuration: number =
    this.recognizer.defaultOptions.maxDuration;

  /**
   * Maximum allowed movement (px).
   * @default 12
   */
  @property({ attribute: "max-displacement", type: Number, reflect: false }) readonly maxDisplacement: number =
    this.recognizer.defaultOptions.maxDisplacement;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  @property({ attribute: "max-press-interval", type: Number, reflect: false }) maxPressInterval: number =
    this.recognizer.defaultOptions.maxPressInterval;

  /**
   * Maximum allowed time (ms) between the earliest and latest release.
   * @default 120
   */
  @property({ attribute: "max-release-interval", type: Number, reflect: false }) maxReleaseInterval: number =
    this.recognizer.defaultOptions.maxReleaseInterval;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    this.recognizer.options = {
      pointers: this.pointers,
      maxPressInterval: this.maxPressInterval,
      maxReleaseInterval: this.maxReleaseInterval,
      maxDuration: this.maxDuration,
      maxDisplacement: this.maxDisplacement,
    };
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
