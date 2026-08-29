/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";

import { SequenceGestureDetail, SequenceGestureRecognizer } from "./SequenceGestureRecognizer";
import { GestureElementBase, GestureRecognizer } from "../core";

/**
 * A non-visual element used to detect a sequence of gestures for an associated element.
 * @tag m3e-sequence-gesture
 *
 * @example
 * The following example illustrates detecting gesture sequences using `<m3e-sequence-gesture>`.
 *
 * The `<m3e-sequence-gesture>` accepts one or more gesture elements, each representing one step in the sequence.
 *
 * The recognizer emits a gesture only after **all child gestures complete
 * in order**. If any gesture fails, the entire sequence fails.
 *
 * The following example illustrates detecting a **press + tap** sequence
 * (long‑press followed by a tap):
 *
 * ```html
 * <div id="div1"></div>
 *
 * <m3e-sequence-gesture for="div1">
 *   <m3e-long-press-gesture></m3e-long-press-gesture>
 *   <m3e-tap-gesture></m3e-tap-gesture>
 * </m3e-sequence-gesture>
 * ```
 *
 * Listen for the `gesture` event to handle completed sequences:
 *
 * ```ts
 * const recognizer = document.querySelector("m3e-sequence-gesture");
 *
 * recognizer.addEventListener("gesture", e => {
 *   const detail = e.detail;
 *
 *   // Sequence steps in order (press detail, then tap detail)
 *   console.log(detail.steps.length);
 *
 *   // Access each step's detail
 *   const pressDetail = detail.steps[0];
 *   const tapDetail = detail.steps[1];
 *
 *   console.log("Press duration:", pressDetail.duration);
 *   console.log("Tap timestamp:", tapDetail.timestamp);
 * });
 * ```
 *
 * @attr buttons - Which buttons can be pressed.
 * @attr pointer-types - Which types of pointers can be used to recognize gestures.
 * @attr disabled - Whether gesture recognition is disabled.
 * @attr priority - The priority in which to recognize gestures.
 * @attr max-interval - Maximum time (ms) between gestures before the sequence fails.
 *
 * @fires gesture - Emitted when a gesture sequence is recognized.
 */
@customElement("m3e-sequence-gesture")
export class M3eSequenceGestureElement extends GestureElementBase<SequenceGestureDetail, SequenceGestureRecognizer> {
  /** @inheritdoc */
  override readonly recognizer = new SequenceGestureRecognizer();

  /**
   * Maximum time (ms) between gestures before the sequence fails.
   * @default 250
   */
  @property({ attribute: "max-interval", type: Number }) maxInterval: number = 250;

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("maxInterval")) {
      this.recognizer.maxInterval = this.maxInterval;
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

    // Update recognizer sequence with nested recognizers (in order of DOM)
    this.recognizer.sequence = sequence;
  }
}

interface M3eSequenceGestureElementEventMap extends HTMLElementEventMap {
  gesture: CustomEvent<SequenceGestureDetail>;
}

export interface M3eSequenceGestureElement {
  addEventListener<K extends keyof M3eSequenceGestureElementEventMap>(
    type: K,
    listener: (this: M3eSequenceGestureElement, ev: M3eSequenceGestureElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eSequenceGestureElementEventMap>(
    type: K,
    listener: (this: M3eSequenceGestureElement, ev: M3eSequenceGestureElementEventMap[K]) => void,
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
    "m3e-sequence-gesture": M3eSequenceGestureElement;
  }
}
