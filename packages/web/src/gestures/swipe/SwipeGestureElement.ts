/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement, spaceSeparatedStringConverter } from "@m3e/web/core";
import { GestureElementBase } from "@m3e/web/gestures";

import { SwipeGestureRecognizer } from "./SwipeGestureRecognizer";
import { SwipeGestureDetail } from "./SwipeGestureDetail";
import { SwipeGestureDirection, SwipeGestureOptions } from "./SwipeGestureOptions";

/**
 * A non-visual element used to detect and interpret swipe gestures from an input stream
 * produced from an attached element.
 *
 * @tag m3e-swipe-gesture
 *
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr pointers - Number of pointers required for the gesture to be recognized.
 * @attr start-threshold - Minimum distance (px) a pointer must move before the gesture starts.
 * @attr min-displacement - * Minimum distance (px) a pointer must move before the gesture can be recognized.
 * @attr min-velocity - Minimum velocity (px/ms) required to recognize a swipe.
 * @attr direction-threshold - Minimum displacement (px) required before direction is considered valid.
 * @attr direction-grace-period - Maximum amount of time (ms) a pointer can move in an uncommitted or
 * disallowed direction before the gesture is rejected.
 * @attr directions - The allowed directions of the swipe.
 * @attr max-press-interval - Maximum allowed time (ms) between the earliest and latest press.
 *
 * @fires gesture - Emitted when semantic detail about a swipe gesture is detected.
 */
@customElement("m3e-swipe-gesture")
export class M3eSwipeGestureElement extends GestureElementBase<SwipeGestureOptions, SwipeGestureDetail> {
  /** @inheritdoc */
  override readonly recognizer = new SwipeGestureRecognizer();

  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 1
   */
  @property({ type: Number, reflect: false }) pointers: number = this.recognizer.defaultOptions.pointers;

  /**
   * Minimum distance (px) a pointer must move before the gesture starts.
   * @default 4
   */
  @property({ attribute: "start-threshold", type: Number, reflect: false }) startThreshold: number =
    this.recognizer.defaultOptions.startThreshold;

  /**
   * * Minimum distance (px) a pointer must move before the gesture can be recognized.
   * @default 12
   */
  @property({ attribute: "min-displacement", type: Number, reflect: false }) minDisplacement: number =
    this.recognizer.defaultOptions.minDisplacement;

  /**
   * Minimum velocity (px/ms) required before the gesture fails.
   * @default 0.3
   */
  @property({ attribute: "min-velocity", type: Number, reflect: false }) minVelocity =
    this.recognizer.defaultOptions.minVelocity;

  /**
   * Minimum displacement (px) required before direction is considered valid.
   * @default 12
   */
  @property({ attribute: "direction-threshold", type: Number, reflect: false }) directionThreshold =
    this.recognizer.defaultOptions.directionThreshold;

  /**
   * Maximum amount of time (ms) a pointer can move in an uncommitted or
   * disallowed direction before the gesture is rejected. When set to 0,
   * early‑direction rejection is disabled.
   * @default 0
   */
  @property({ attribute: "direction-grace-period", type: Number, reflect: false }) directionGracePeriod: number =
    this.recognizer.defaultOptions.directionGracePeriod;

  /**
   * The allowed directions of the swipe.
   * @default ["left", "right", "up", "down"]
   */
  @property({ converter: spaceSeparatedStringConverter, reflect: false })
  directions: readonly SwipeGestureDirection[] = this.recognizer.defaultOptions.directions;

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
      startThreshold: this.startThreshold,
      minDisplacement: this.minDisplacement,
      minVelocity: this.minVelocity,
      directionThreshold: this.directionThreshold,
      directionGracePeriod: this.directionGracePeriod,
      directions: this.directions,
      maxPressInterval: this.maxPressInterval,
    };
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
