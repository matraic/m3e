/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";
import { GestureElementBase, GestureRecognizer } from "@m3e/web/gestures";

import { RepeatGestureRecognizer } from "./RepeatGestureRecognizer";
import { RepeatGestureOptions } from "./RepeatGestureOptions";
import { RepeatGestureDetail } from "./RepeatGestureDetail";

/**
 * A non-visual element used to detect and interpret repeated gestures from an input stream
 * produced from an attached element.
 *
 * @tag m3e-repeat-gesture
 *
 * @slot - The gesture to repeat.
 *
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr max-interval - Maximum allowed time (ms) between consecutive gesture occurrences.
 * @attr count - Number of times a gesture must be repeated.
 *
 * @fires gesture - Emitted when semantic detail about a repeated gesture is detected.
 */
@customElement("m3e-repeat-gesture")
export class M3eRepeatGestureElement extends GestureElementBase<RepeatGestureOptions, RepeatGestureDetail> {
  /** @inheritdoc */
  override readonly recognizer = new RepeatGestureRecognizer();

  /**
   * Maximum allowed time (ms) between consecutive gesture occurrences.
   * @default 250
   */
  @property({ attribute: "max-interval", type: Number, reflect: false }) maxInterval: number =
    this.recognizer.defaultOptions.maxInterval;

  /**
   * Number of times a gesture must be repeated.
   * @default 2
   */
  @property({ type: Number, reflect: false }) count: number = this.recognizer.defaultOptions.count;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);
    this.recognizer.options = {
      maxInterval: this.maxInterval,
      count: this.count,
    };
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
      // Ensure nested elements are not attached.
      if (element.htmlFor) {
        element.detach();
        element.removeAttribute("for");
      }
      sequence.push(element.recognizer);
    }

    // Update recognizer with first recognizer (in order of DOM).
    this.recognizer.recognizer = sequence[0];
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
