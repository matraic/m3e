/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";

import { GestureElementBase, GestureRecognizer } from "../core";
import { RepeatGestureDetail, RepeatGestureRecognizer } from "./RepeatGestureRecognizer";

/**
 * A non-visual element used to detect a repeated gesture for an associated element.
 * @tag m3e-repeat-gesture
 *
 * @example
 * The following example illustrates detecting repeated gestures on an element using `<m3e-repeat-gesture>`.
 *
 * The `<m3e-repeat-gesture>` accepts a **single child gesture element** which defines the gesture to repeat.
 *
 * Use the `count` attribute to specify how many times the gesture must occur
 * before it is recognized. The default value is **2** (double‑gesture).
 *
 * ```html
 * <div id="div1"></div>
 *
 * <!-- Detect a double‑tap (default count = 2) -->
 * <m3e-repeat-gesture for="div1">
 *   <m3e-tap-gesture></m3e-tap-gesture>
 * </m3e-repeat-gesture>
 *
 * <!-- Detect a triple‑tap -->
 * <m3e-repeat-gesture for="div1" count="3">
 *   <m3e-tap-gesture></m3e-tap-gesture>
 * </m3e-repeat-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle repeated gestures:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-repeat-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Number of completed occurrences (e.g., 2 for a double‑tap)
 *   console.log(detail.occurrences.length);
 *
 *   // Access each occurrence's detail
 *   detail.occurrences.forEach((occ, i) => {
 *     console.log(`Occurrence ${i + 1}:`, occ.timestamp);
 *   });
 * });
 * ```
 *
 * @attr allowed-buttons - Which buttons can be pressed.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr max-interval - Maximum time (ms) between gestures before the sequence fails.
 * @attr count - Number of times a gesture must be repeated.
 *
 * @fires gesture - Emitted when a repeated gesture is recognized.
 */
@customElement("m3e-repeat-gesture")
export class M3eRepeatGestureElement extends GestureElementBase<RepeatGestureDetail, RepeatGestureRecognizer> {
  /** @inheritdoc */
  override readonly recognizer = new RepeatGestureRecognizer();

  /**
   * Maximum time (ms) between gestures before the repeated gesture fails.
   * @default 250
   */
  @property({ attribute: "max-interval", type: Number }) maxInterval: number = 250;

  /**
   * Number of times a gesture must be repeated.
   * @default 2
   */
  @property({ type: Number }) count: number = 2;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("maxInterval")) {
      this.recognizer.maxInterval = this.maxInterval;
    }
    if (_changedProperties.has("count")) {
      this.recognizer.count = this.count;
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    const elements = (<HTMLSlotElement>e.target)
      .assignedElements({ flatten: true })
      .filter((x) => x instanceof GestureElementBase);

    const sequence = new Array<GestureRecognizer>();

    for (const element of elements) {
      // Ensure nested elements are not attached
      if (element.htmlFor) {
        element.detach();
        element.removeAttribute("for");
      }
      sequence.push(element.recognizer);
    }

    // Update recognizer with first recognizer (in order of DOM)
    this.recognizer.recognizer = sequence[0] ?? null;
  }
}

interface M3eRepeatGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<RepeatGestureDetail>;
}

export interface M3eRepeatGestureElement {
  addEventListener<K extends keyof M3eRepeatGestureElementEventMap>(
    type: K,
    listener: (this: M3eRepeatGestureElement, ev: M3eRepeatGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eRepeatGestureElementEventMap>(
    type: K,
    listener: (this: M3eRepeatGestureElement, ev: M3eRepeatGestureElementEventMap[K]) => void,
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
    "m3e-repeat-gesture": M3eRepeatGestureElement;
  }
}
